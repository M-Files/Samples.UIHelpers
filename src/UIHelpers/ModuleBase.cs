using MFiles.VAF.Common;
using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.Logging;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UIHelpers
{
    internal abstract class ModuleBase
        : MethodSource
    {
        protected ILogger Logger { get; }
        protected VaultApplication VaultApplication { get; set; }
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
        public virtual void InitializeApplication(Vault vault) { }

        /// <inheritdoc />
        public virtual IEnumerable<ValidationFinding> CustomValidation(Vault vault, object config)
        {
            return Enumerable.Empty<ValidationFinding>();
        }
    }

    internal abstract class ModuleBase<TConfigurationType>
        : ModuleBase
        where TConfigurationType : class, new()
    {
        protected abstract TConfigurationType Configuration { get; }
        public ModuleBase(VaultApplication vaultApplication)
            : base(vaultApplication)
        {
        }

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

        /// <inheritdoc />
        public virtual IEnumerable<ValidationFinding> CustomValidation(Vault vault, TConfigurationType config)
        {
            return Enumerable.Empty<ValidationFinding>();
        }
    }
}
