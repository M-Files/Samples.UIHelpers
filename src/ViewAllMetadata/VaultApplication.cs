using MFiles.VAF;
using MFiles.VAF.AppTasks;
using MFiles.VAF.Common;
using MFiles.VAF.Configuration;
using MFiles.VAF.Core;
using MFilesAPI;
using System;
using System.Diagnostics;

namespace SeparatePreview
{
    public class VaultApplication
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
                string appPath = "SeparatePreview.UIX.mfappx";
                if (System.IO.File.Exists(appPath))
                {
                    vault.CustomApplicationManagementOperations.InstallCustomApplication(appPath);
                }
                else
                {
                    this.Logger?.Fatal($"Could not install Separate Preview UIX application; {appPath} does not exist.");
                }
            }
            catch (Exception ex)
            {
                if (!MFUtils.IsMFilesAlreadyExistsError(ex))
                    this.Logger?.Fatal(ex, $"Could not install Separate Preview UIX application.");
            }

            base.InitializeApplication(vault);
        }

        #endregion

#pragma warning disable IDE0051 // Remove unused private members
        /// <summary>
        /// Registers a Vault Extension Method with name "SeparatePreview.GetUIXConfiguration".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("SeparatePreview.GetUIXConfiguration",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string GetUIXConfiguration(EventHandlerEnvironment env)
        {
            // Create and populate the configuration.
            var configuration = new UIXConfiguration()
            {
                // Use the task pane config from the configuration, if we have it, or fall back to the default.
                TaskPaneConfiguration =
                    this.Configuration?.TaskPaneConfiguration
                    ?? new TaskPaneConfiguration(),

                // Create the resource strings from the provider, or default to none.
                ResourceStrings = 
                    this.ResourceStringProvider?.Create
                    (
                        env.Input.ToLower(), 
                        this.Configuration?.LanguageOverrides?.ToArray()
                    )
                    ?? new ResourceStrings()
			};

            // Serialize the configuration for use in the UIX application.
            return Newtonsoft.Json.JsonConvert.SerializeObject(configuration);
        }
#pragma warning restore IDE0051 // Remove unused private members

    }
}