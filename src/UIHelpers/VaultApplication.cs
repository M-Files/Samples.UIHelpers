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
        protected internal List<ModuleBase> Modules { get; }
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

        /// <summary>
        /// Returns the module for the given <paramref name="input"/>.
        /// </summary>
        /// <typeparam name="TExpectedType">The expected module type.</typeparam>
        /// <param name="input">Data about the module.</param>
        /// <returns>The module, or null.</returns>
        protected virtual TExpectedType GetModule<TExpectedType>(VEMInputBase input)
            where TExpectedType : class
        {
            return this.GetModule(input) as TExpectedType;
        }

        /// <summary>
        /// Returns the module for the given <paramref name="input"/>.
        /// </summary>
        /// <param name="input">Data about the module.</param>
        /// <returns>The module, or null.</returns>
        protected virtual ModuleBase GetModule(VEMInputBase input)
        {
            // Sanity.
            if (null == input)
                return null;

            // Use the other overload.
            return this.GetModule(input.Module);
        }

        /// <summary>
        /// Returns the module with the given <paramref name="moduleName"/>.
        /// </summary>
        /// <param name="moduleName">The name of the module.</param>
        /// <returns>The module, or null.</returns>
        protected virtual ModuleBase GetModule(string moduleName)
        {
            // Sanity.
            if (null == this.Modules)
                return null;

            // Find the module.
            foreach (var m in this.Modules)
            {
                if (null == m)
                    continue;
                if (moduleName == m.GetType().FullName)
                    return m;
            }

            // None.
            return null;

        }

        /// <summary>
        /// Returns the module with the given <paramref name="moduleName"/>.
        /// </summary>
        /// <typeparam name="TExpectedType">The expected module type.</typeparam>
        /// <param name="moduleName">The name of the module.</param>
        /// <returns>The module, or null.</returns>
        protected virtual TExpectedType GetModule<TExpectedType>(string moduleName)
            where TExpectedType : class
        {
            return this.GetModule(moduleName) as TExpectedType;
        }

        #endregion

        #region Dashboard generation

        /// <inheritdoc />
        /// <remarks>This does not use any async operations, so hide it.</remarks>
        public override IDashboardContent GetAsynchronousOperationDashboardContent(IConfigurationRequestContext context)
            => null;

        #endregion

        #region Configuration validation

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

        #endregion

        protected class VEMInputBase
        {
            public string Module { get; set; }
        }
        protected class GetUIXConfigurationVEMInput
            : VEMInputBase
        {
            public string Language { get; set; }
        }
        protected class PersistWindowDataVEMInput
            : VEMInputBase
        {
            public WindowLocation Location { get; set; }
            public int Height { get; set; }
            public int Width { get; set; }
        }

    }
}