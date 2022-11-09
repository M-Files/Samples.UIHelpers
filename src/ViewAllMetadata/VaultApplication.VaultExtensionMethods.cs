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
        /// Registers a Vault Extension Method with name "ViewAllMetadata.GetUIXConfiguration".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("ViewAllMetadata.GetUIXConfiguration",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string GetUIXConfiguration(EventHandlerEnvironment env)
        {
            // Create and populate the configuration.
            var configuration = new UIXConfiguration()
            {
                // Create the resource strings from the provider, or default to none.
                ResourceStrings =
                    this.ResourceStringProvider?.Create
                    (
                        env.Input.ToLower(),
                        this.Configuration?.AdvancedConfiguration?.LanguageOverrides?.ToArray()
                    )
                    ?? new ResourceStrings()
            };

            // Serialize the configuration for use in the UIX application.
            return Newtonsoft.Json.JsonConvert.SerializeObject(configuration);
        }

        /// <summary>
        /// Registers a Vault Extension Method with name "ViewAllMetadata.ShouldShowAllMetadata".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("ViewAllMetadata.ShouldShowAllMetadata",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string ShouldShowAllMetadata(EventHandlerEnvironment env)
        {
            return
            (
                this
                    .Configuration?
                    .UserIsAllowedAccess(env.Vault, env.CurrentUserSessionInfo) ?? false
            )
                .ToString()
                .ToLower();
        }

    }
}