using MFiles.VAF.Common;
using MFilesAPI;
using System.Linq;
using UIHelpers.Modules.Base;

namespace UIHelpers.Modules.ShowPreview
{
    internal class Module
        : ModuleBase<Configuration, UIXConfiguration>
    {
        /// <inheritdoc />
        protected override Configuration Configuration
            => this.VaultApplication?.Configuration?.ShowPreview;

        public Module(VaultApplication vaultApplication) 
            : base(vaultApplication)
        {
            this.UIXApplicationPaths.Add("ShowPreview.UIX.mfappx");
        }

        public override UIXConfiguration GetUIXConfiguration(string language)
        {
            // Create and populate the configuration.
            var configuration = new UIXConfiguration()
            {
                // Create the resource strings from the provider, or default to none.
                ResourceStrings =
                    this.VaultApplication.ResourceStringProvider?.Create
                    (
                        language?.Trim()?.ToLower(),
                        this.VaultApplication?.Configuration?.AdvancedConfiguration?.LanguageOverrides
                    )
                    ?? new ResourceStrings(),
                DefaultLocation = this.Configuration?.AdvancedConfiguration?.DefaultLocation 
                    ?? AdvancedConfigurationBase.DefaultLocationDefault,
                PopupWindowHeight = this.Configuration?.AdvancedConfiguration?.DefaultPopupWindowHeight
                    ?? AdvancedConfigurationBase.DefaultPopupWindowHeightDefault,
                PopupWindowWidth = this.Configuration?.AdvancedConfiguration?.DefaultPopupWindowWidth
                    ?? AdvancedConfigurationBase.DefaultPopupWindowWidthDefault,
            };
            if (this.Configuration?.AdvancedConfiguration?.AllowedLocations?.Any() ?? false)
            {
                configuration.AllowedLocations = this.Configuration.AdvancedConfiguration.AllowedLocations.ToArray();
            }

            // Serialize the configuration for use in the UIX application.
            return configuration;
        }
    }
}
