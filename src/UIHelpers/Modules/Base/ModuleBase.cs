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
        : ModuleBase
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
