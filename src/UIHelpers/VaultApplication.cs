using MFiles.VAF.Common;
using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.AdminConfigurations;
using MFiles.VAF.Configuration.Domain.Dashboards;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using UIHelpers.Modules.Base;

namespace UIHelpers
{
    public partial class VaultApplication
        : MFiles.VAF.Extensions.ConfigurableVaultApplicationBase<Configuration>
    {
        /// <summary>
        /// The resource string provider to use.
        /// </summary>
        protected internal IResourceStringProvider ResourceStringProvider { get; set; }
            = new DefaultResourceStringProvider();

        /// <summary>
        /// Expose the configuration for internal use too.
        /// </summary>
        protected internal new Configuration Configuration
        {
            get => base.Configuration;
            set => base.Configuration = value;
        }

        public VaultApplication()
        {
            // Add our modules.
            this.Modules.Add(new Modules.ViewAllMetadata.Module(this));
            this.Modules.Add(new Modules.ShowPreview.Module(this));
        }

        #region Deal with modules

        /// <summary>
        /// The current modules in the application.
        /// </summary>
        internal List<ModuleBase> Modules { get; }
            = new List<ModuleBase>();

        /// <inheritdoc />
        /// <remarks>Installs the UIX application.</remarks>
        protected override void InitializeApplication(Vault vault)
        {
            // Initialise each module.
            foreach (var module in this.Modules)
                module?.InitializeApplication(vault);

            base.InitializeApplication(vault);
        }

        /// <inheritdoc />
        /// <remarks>Allows us to use [VaultExtensionMethod] (etc.) within the modules themselves.</remarks>
        protected override void RegisterMethodsFromSource(IMethodSource source, Vault vault)
        {
            // Register our ones.
            base.RegisterMethodsFromSource(source, vault);

            // Register ones from each module.
            foreach (var module in this.Modules)
                if (null != module)
                    base.RegisterMethodsFromSource(module, vault);
        }

        #endregion

        /// <inheritdoc />
        /// <remarks>This does not use any async operations, so hide it.</remarks>
        public override IDashboardContent GetAsynchronousOperationDashboardContent(IConfigurationRequestContext context)
            => null;

        /// <inheritdoc />
        protected override IEnumerable<ValidationFinding> CustomValidation(Vault vault, Configuration config)
        {
            foreach (var vf in base.CustomValidation(vault, config))
                yield return vf;

            // Let the config validate itself.
            if(null != config)
                foreach (var vf in config?.CustomValidation(vault) ?? Enumerable.Empty<ValidationFinding>())
                    yield return vf;

            // Validate any modules.
            foreach(var m in this.Modules)
                if(null != m)
                    foreach(var vf in m.CustomValidation(vault, config))
                        yield return vf;
        }

        /// <summary>
        /// Registers a Vault Extension Method with name "UIHelpers.GetUIXConfiguration".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// This method retrieves the UIX configuration for a specific module.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("UIHelpers.GetUIXConfiguration",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string GetUIXConfiguration(EventHandlerEnvironment env)
        {
            try
            {
                var input = Newtonsoft.Json.JsonConvert.DeserializeObject<GetUIXConfigurationVEMInput>(env.Input);
                if (null == input)
                    throw new ArgumentException("Environment input invalid");
                foreach(var m in this.Modules)
                {
                    if(input.Module == m.GetType().FullName)
                    {
                        if (m is ISuppliesUIXConfiguration c)
                            return Newtonsoft.Json.JsonConvert.SerializeObject(c.GetUIXConfiguration(input.Language));
                    }
                }
            }
            catch (Exception e)
            {
                this.Logger?.Error(e, $"Could not get UIX configuration from input.");
            }
            return "Invalid input";
        }

        /// <summary>
        /// Registers a Vault Extension Method with name "UIHelpers.PersistWindowData".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// This method saves the current window data for the user so that it'll open again here next time.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("UIHelpers.PersistWindowData",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string PersistWindowData(EventHandlerEnvironment env)
        {
            try
            {
                var input = Newtonsoft.Json.JsonConvert.DeserializeObject<PersistWindowDataVEMInput>(env.Input);
                if (null == input)
                    throw new ArgumentException("Environment input invalid");
                foreach (var m in this.Modules)
                {
                    if (input.Module == m.GetType().FullName)
                    {
                        if (m is ICanWriteWindowData c)
                        {
                            c.PersistWindowData(env.Vault, input.Location, input.Height, input.Width);
                            return "true";
                        }
                    }
                }
            }
            catch (Exception e)
            {
                this.Logger?.Error(e, $"Could not get window data from input.");
            }
            return "Invalid input";
        }

        /// <summary>
        /// Registers a Vault Extension Method with name "UIHelpers.ShouldShow".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// This method retrieves whether a specific module should be shown.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("UIHelpers.ShouldShow",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string ShouldShow(EventHandlerEnvironment env)
        {
            try
            {
                var input = Newtonsoft.Json.JsonConvert.DeserializeObject<VEMInputBase>(env.Input);
                if (null == input)
                    throw new ArgumentException("Environment input invalid");
                foreach (var m in this.Modules)
                {
                    if (input.Module == m.GetType().FullName)
                    {
                        if (m is ISuppliesUIXConfiguration c)
                            return c.ShouldShow(env.Vault, env.CurrentUserSessionInfo).ToString()?.ToLower();
                    }
                }
            }
            catch (Exception e)
            {
                this.Logger?.Error(e, $"Could not get data from input.");
            }
            return "Invalid input";
        }

        private class VEMInputBase
        {
            public string Module { get; set; }
        }
        private class GetUIXConfigurationVEMInput
            : VEMInputBase
        {
            public string Language { get; set; }
        }
        private class PersistWindowDataVEMInput
            : VEMInputBase
        {
            public WindowLocation Location { get; set; }
            public int Height { get; set; }
            public int Width { get; set; }
        }

    }
}