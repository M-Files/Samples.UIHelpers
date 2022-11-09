using MFiles.VAF;
using MFiles.VAF.AppTasks;
using MFiles.VAF.Common;
using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.AdminConfigurations;
using MFiles.VAF.Configuration.Domain.Dashboards;
using MFiles.VAF.Core;
using MFilesAPI;
using System;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;

namespace ViewAllMetadata
{
    public partial class VaultApplication
        : MFiles.VAF.Extensions.ConfigurableVaultApplicationBase<Configuration>
    {
        /// <summary>
        /// The resource string provider to use.
        /// </summary>
        protected IResourceStringProvider ResourceStringProvider { get; set; }
            = new DefaultResourceStringProvider();

        #region Install the UIX application

        /// <inheritdoc />
        /// <remarks>Installs the UIX application.</remarks>
        protected override void InitializeApplication(Vault vault)
        {
            try
            {
                string appPath = "ViewAllMetadata.UIX.mfappx";
                if (System.IO.File.Exists(appPath))
                {
                    vault.CustomApplicationManagementOperations.InstallCustomApplication(appPath);
                }
                else
                {
                    this.Logger?.Fatal($"Could not install View all Metadata UIX application; {appPath} does not exist.");
                }
            }
            catch (Exception ex)
            {
                if (!MFUtils.IsMFilesAlreadyExistsError(ex))
                    this.Logger?.Fatal(ex, $"Could not install  View all Metadata UIX application.");
            }

            base.InitializeApplication(vault);
        }

        #endregion

        /// <inheritdoc />
        /// <remarks>This does not use any async operations, so hide it.</remarks>
        public override IDashboardContent GetAsynchronousOperationDashboardContent(IConfigurationRequestContext context) => null;

        /// <inheritdoc />
        /// <remarks>Adds the project resource managers.</remarks>
        protected override void StartApplication()
        {
            base.StartApplication();
            this.AddResourceManagerToConfiguration(Resources.UIResources.ResourceManager);
            this.AddResourceManagerToConfiguration(Resources.Configuration.ResourceManager);
        }

    }
}