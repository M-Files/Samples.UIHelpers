using MFiles.VAF.Common;
using MFilesAPI;
using System.Linq;
using UIHelpers.Modules.Base;

namespace UIHelpers.Modules.ViewAllMetadata
{
    internal class Module
        : ModuleBase<Configuration, UIXConfiguration>
    {
        /// <inheritdoc />
        protected override Configuration Configuration
            => this.VaultApplication?.Configuration?.ViewAllMetadata;

        public Module(VaultApplication vaultApplication) 
            : base(vaultApplication)
        {
            this.UIXApplicationPaths.Add("ViewAllMetadata.UIX.mfappx");
        }

        public override UIXConfiguration GetUIXConfiguration(string language)
        {
            // Get where the default window should be.
            this.GetWindowData
            (
                this.VaultApplication.PermanentVault,
                this.Configuration?.AdvancedConfiguration,
                out WindowLocation windowLocation,
                out int windowHeight,
                out int windowWidth
            );

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
                EnableEditing = this.Configuration?.EnableEditing ?? false,
                DefaultLocation = windowLocation,
                PopupWindowHeight = windowHeight,
                PopupWindowWidth = windowWidth,
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
