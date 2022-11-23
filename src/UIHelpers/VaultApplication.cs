using MFiles.VAF;
using MFiles.VAF.AppTasks;
using MFiles.VAF.Common;
using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.AdminConfigurations;
using MFiles.VAF.Configuration.Domain.Dashboards;
using MFiles.VAF.Core;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;

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
            this.Modules.Add(new ViewAllMetadata.Module(this));
            this.Modules.Add(new ShowPreview.Module(this));
        }

        #region Deal with modules

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

    }
}