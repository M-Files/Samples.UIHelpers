using MFiles.VAF.Common;
using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.Logging;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;

namespace UIHelpers.Modules.Base
{
    internal abstract class ModuleBase
        : MethodSource
    {
        /// <summary>
        /// The logger for this class.
        /// </summary>
        protected ILogger Logger { get; }

        /// <summary>
        /// The vault application that this module is installed in.
        /// </summary>
        protected VaultApplication VaultApplication { get; }

        public ModuleBase(VaultApplication vaultApplication)
        {
            this.Logger = LogManager.GetLogger(this.GetType());
            this.VaultApplication = vaultApplication
                ?? throw new ArgumentNullException(nameof(vaultApplication));
        }

        /// <summary>
        /// Protected overridable for the child classes to override instead of Initialize.
        /// InitializeApplication can be used to make changes to the vault structure.
        /// </summary>
        /// <param name="vault">A transactional vault, that has been cloned to this process.</param>
        public virtual void InitializeApplication(Vault vault)
        {
            this.InstallUIXApplications(vault);
        }

        /// <summary>
        /// Installs all applications in <see cref="UIXApplicationPaths"/>
        /// to the <paramref name="vault"/>.
        /// </summary>
        /// <param name="vault">The vault to install to.</param>
        protected virtual void InstallUIXApplications(Vault vault)
        {
            if (!this.HasUIXApplications)
                return;

            foreach(var applicationPath in this.UIXApplicationPaths ?? Enumerable.Empty<string>())
            {
                this.InstallUIXApplication(vault, applicationPath);
            }

        }

        /// <summary>
        /// Installs a specific application at 
        /// <paramref name="applicationPath"/>
        /// to the <paramref name="vault"/>.
        /// </summary>
        /// <param name="vault">The vault to install to.</param>
        /// <param name="applicationPath">The (relative) path to the application to install.</param>
        protected virtual void InstallUIXApplication(Vault vault, string applicationPath)
        {
            if (string.IsNullOrWhiteSpace(applicationPath))
                return;

            try
            {
                if (System.IO.File.Exists(applicationPath))
                {
                    vault.CustomApplicationManagementOperations.InstallCustomApplication(applicationPath);
                }
                else
                {
                    this.Logger?.Fatal($"Could not install UIX application; {applicationPath} does not exist.");
                }
            }
            catch (Exception ex)
            {
                if (!MFUtils.IsMFilesAlreadyExistsError(ex))
                    this.Logger?.Fatal(ex, $"Could not install UIX application.");
            }

        }

        /// <summary>
        /// The path(s) to any child UIX application(s).
        /// </summary>
        protected List<string> UIXApplicationPaths { get; }
            = new List<string>();

        /// <summary>
        /// Whether there are any UIX applications used by this module.
        /// </summary>
        public bool HasUIXApplications
        {
            get => (this.UIXApplicationPaths?.Count ?? 0) > 0;
        }

        /// <summary>
        /// Performs any validation on the <paramref name="config"/>.
        /// </summary>
        /// <param name="vault">The vault in which the configuration is in.</param>
        /// <param name="config">The new configuration.</param>
        /// <returns>Any validation findings.</returns>
        public virtual IEnumerable<ValidationFinding> CustomValidation(Vault vault, object config)
        {
            return Enumerable.Empty<ValidationFinding>();
        }
    }

    internal abstract class ModuleBase<TConfigurationType>
        : ModuleBase, ICanWriteWindowData, ICanReadWindowData
        where TConfigurationType : ConfigurationBase, new()
    {
        /// <summary>
        /// The configuration of this module.
        /// </summary>
        protected abstract TConfigurationType Configuration { get; }

        public ModuleBase(VaultApplication vaultApplication)
            : base(vaultApplication)
        {
        }

        /// <inheritdoc />
        public override IEnumerable<ValidationFinding> CustomValidation(Vault vault, object config)
        {
            // Add any base findings.
            var findings = new List<ValidationFinding>();
            findings.AddRange(base.CustomValidation(vault, config));

            // If this is the correct type then validate it.
            if (config is TConfigurationType typedConfig)
                findings.AddRange(this.CustomValidation(vault, typedConfig));

            return findings;
        }

        /// <summary>
        /// Performs any validation on the <paramref name="config"/>.
        /// </summary>
        /// <param name="vault">The vault in which the configuration is in.</param>
        /// <param name="config">The new configuration.</param>
        /// <returns>Any validation findings.</returns>
        public virtual IEnumerable<ValidationFinding> CustomValidation(Vault vault, TConfigurationType config)
        {
            return Enumerable.Empty<ValidationFinding>();
        }

        /// <inheritdoc />
        public void PersistWindowData(Vault vault, WindowLocation location, int height, int width)
        {
            // Get the named values.
            var type = MFNamedValueType.MFUserDefinedValue;
            var ns = this.GetType().FullName + ".WindowData";
            var namedValues = vault.NamedValueStorageOperations.GetNamedValues
            (
                type,
                ns
            ) ?? new NamedValues();

            // Set the data.
            namedValues["Location"] = (int)location;
            namedValues["Height"] = height > 100 ? height : 100;
            namedValues["Width"] = width > 100 ? width : 100;

            // If any are default then remove them.
            if (location == AdvancedConfigurationBase.DefaultLocationDefault)
                namedValues["Location"] = null;
            if (height == AdvancedConfigurationBase.DefaultPopupWindowHeightDefault)
                namedValues["Height"] = null;
            if (width == AdvancedConfigurationBase.DefaultPopupWindowWidthDefault)
                namedValues["Width"] = null;

            // Set the named values.
            vault.NamedValueStorageOperations.SetNamedValues
            (
                type,
                ns,
                namedValues
            );
        }

        public void GetWindowData(Vault vault, AdvancedConfigurationBase advancedConfiguration, out WindowLocation location, out int height, out int width)
        {
            // Get the named values.
            var type = MFNamedValueType.MFUserDefinedValue;
            var ns = this.GetType().FullName + ".WindowData";
            var namedValues = vault.NamedValueStorageOperations.GetNamedValues
            (
                type,
                ns
            ) ?? new NamedValues();

            // Set the defaults.
            location = advancedConfiguration?.DefaultLocation ?? AdvancedConfigurationBase.DefaultLocationDefault;
            height = advancedConfiguration?.DefaultPopupWindowHeight ?? AdvancedConfigurationBase.DefaultPopupWindowHeightDefault;
            width = advancedConfiguration?.DefaultPopupWindowWidth ?? AdvancedConfigurationBase.DefaultPopupWindowWidthDefault;

            // Can we parse out the location?
            if (namedValues.Contains("Location") && Enum.TryParse(namedValues["Location"]?.ToString(), out WindowLocation l))
                location = l;

            // Can we parse out the height?
            if (namedValues.Contains("Height") && Int32.TryParse(namedValues["Height"]?.ToString(), out int h) && h > 100)
                height = h;

            // Can we parse out the width?
            if (namedValues.Contains("Width") && Int32.TryParse(namedValues["Width"]?.ToString(), out int w) && w > 100)
                width = w;
        }
    }
    internal abstract class ModuleBase<TConfigurationType, TUIXConfiguration>
        : ModuleBase<TConfigurationType>, ISuppliesUIXConfiguration
        where TConfigurationType : ConfigurationBase, new()
    {
        public ModuleBase(VaultApplication vaultApplication)
            : base(vaultApplication)
        {
        }
        public abstract TUIXConfiguration GetUIXConfiguration(string language);

        public virtual bool ShouldShow(Vault vault, SessionInfo sessionInfo)
        {
            // If the module is disabled then return disabled.
            if (false == (this.Configuration?.Enabled ?? false))
                return false;
            return
            (
                this.Configuration?
                    .UserIsAllowedAccess(vault, sessionInfo) ?? false
            );
        }
        object ISuppliesUIXConfiguration.GetUIXConfiguration(string language) => this.GetUIXConfiguration(language);
    }
}
