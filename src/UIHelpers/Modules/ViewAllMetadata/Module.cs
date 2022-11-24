using MFiles.VAF.Common;
using MFilesAPI;
using System.Linq;
using UIHelpers.Modules.Base;

namespace UIHelpers.Modules.ViewAllMetadata
{
    internal class Module
        : ModuleBase<Configuration>
    {
        /// <inheritdoc />
        protected override Configuration Configuration
            => this.VaultApplication?.Configuration?.ViewAllMetadata;

        public Module(VaultApplication vaultApplication) 
            : base(vaultApplication)
        {
            this.UIXApplicationPaths.Add("ViewAllMetadata.UIX.mfappx");
        }

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
                    this.VaultApplication.ResourceStringProvider?.Create
                    (
                        env.Input.ToLower(),
                        this.VaultApplication?.Configuration?.AdvancedConfiguration?.LanguageOverrides
                    )
                    ?? new ResourceStrings(),
                EnableEditing = this.Configuration?.EnableEditing ?? false,
                DefaultLocation = this.Configuration?.AdvancedConfiguration?.DefaultLocation ?? WindowLocation.BottomPane
            };
            if (this.Configuration?.AdvancedConfiguration?.AllowedLocations?.Any() ?? false)
            {
                configuration.AllowedLocations = this.Configuration.AdvancedConfiguration.AllowedLocations.ToArray();
            }

            // Serialize the configuration for use in the UIX application.
            return Newtonsoft.Json.JsonConvert.SerializeObject(configuration);
        }

        /// <summary>
        /// Registers a Vault Extension Method with name "ViewAllMetadata.ShouldShow".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("ViewAllMetadata.ShouldShow",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string ShouldShow(EventHandlerEnvironment env)
        {
            // If the module is disabled then return disabled.
            if (false == (this.Configuration?.Enabled ?? false))
                return "false";
            return
            (
                this.Configuration?
                    .UserIsAllowedAccess(env.Vault, env.CurrentUserSessionInfo) ?? false
            )
                .ToString()
                .ToLower();
        }
    }
}
