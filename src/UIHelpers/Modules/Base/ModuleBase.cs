using MFiles.VAF.Common;
using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.Logging;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using UIHelpers.Locations.WindowLocations;

namespace UIHelpers.Modules.Base
{
    public abstract class ModuleBase
        : MethodSource
    {
        /// <summary>
        /// Gets the configuration of this module.
        /// </summary>
        public abstract ConfigurationBase GetConfiguration();

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

        #region Handle installing any UIX applications

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

        #endregion

        #region Any custom validation

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

        #endregion
    }

    public abstract class ModuleBase<TConfigurationType>
        : ModuleBase
        where TConfigurationType : ConfigurationBase, new()
    {
        /// <inheritdoc />
        /// <remarks>Delegates to <see cref="GetTypedConfiguration"/>.</remarks>
        public override ConfigurationBase GetConfiguration()
            => this.GetTypedConfiguration();

        /// <summary>
        /// Gets the configuration of this module.
        /// </summary>
        /// <returns>The configuration.</returns>
        public abstract TConfigurationType GetTypedConfiguration();

        public ModuleBase(VaultApplication vaultApplication)
            : base(vaultApplication)
        {
        }

        #region Any custom validation

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

        #endregion

    }

    public abstract class ModuleBase<TConfigurationType, TUIXConfiguration>
        : ModuleBase<TConfigurationType>, ISuppliesUIXConfiguration
        where TConfigurationType : ConfigurationBase, new()
        where TUIXConfiguration : UIXConfigurationBase, new()
    {
        public ModuleBase(VaultApplication vaultApplication)
            : base(vaultApplication)
        {
        }
        protected virtual TUIXConfiguration CreateEmptyUIXConfiguration()
            => new TUIXConfiguration();

        protected virtual void PopulateUIXConfiguration
        (
            string language,
            IWindowLocationRepository windowLocationRepository,
            TUIXConfiguration uixConfiguration
        )
        {
            // Sanity.
            if (null == windowLocationRepository)
                throw new ArgumentNullException(nameof(windowLocationRepository), "The window location repository cannot be null.");

            var config = this.GetConfiguration();

            // Get where the default window should be.
            windowLocationRepository.GetWindowLocationForCurrentUser
            (
                this,
                config?.AdvancedConfiguration,
                out WindowLocation windowLocation,
                out int windowHeight,
                out int windowWidth
            );
            uixConfiguration.DefaultLocation = windowLocation;
            uixConfiguration.PopupWindowHeight = windowHeight;
            uixConfiguration.PopupWindowWidth = windowWidth;

            // Create the resource strings from the provider, or default to none.
            uixConfiguration.
                ResourceStrings =
                    this.VaultApplication.ResourceStringProvider?.Create
                    (
                        language?.Trim()?.ToLower(),
                        this.VaultApplication?.Configuration?.AdvancedConfiguration?.LanguageOverrides
                    )
                    ?? new ResourceStrings();
            uixConfiguration.CommandLocation = (int)(config?.AdvancedConfiguration?.CommandLocation ?? Locations.MenuLocation.MenuLocation_ContextMenu_Top);
            uixConfiguration.CommandPriority= config?.AdvancedConfiguration?.CommandPriority ?? 1;
            if (config?.AdvancedConfiguration?.AllowedLocations?.Any() ?? false)
            {
                uixConfiguration.AllowedLocations = config?.AdvancedConfiguration.AllowedLocations.ToArray();
            }
        }

        public virtual TUIXConfiguration GetUIXConfiguration
        (
            string language,
            IWindowLocationRepository windowLocationRepository
        )
        {
            var c = this.CreateEmptyUIXConfiguration();
            this.PopulateUIXConfiguration(language, windowLocationRepository, c);
            return c;
        }

        public virtual bool ShouldShow(Vault vault, SessionInfo sessionInfo)
        {
            var config = this.GetConfiguration();

            // If the module is disabled then return disabled.
            if (false == (config?.Enabled ?? false))
                return false;
            return
            (
                config?
                    .UserIsAllowedAccess(vault, sessionInfo) ?? false
            );
        }
        object ISuppliesUIXConfiguration.GetUIXConfiguration(string language, IWindowLocationRepository windowLocationRepository) 
            => this.GetUIXConfiguration(language, windowLocationRepository);
    }
}
