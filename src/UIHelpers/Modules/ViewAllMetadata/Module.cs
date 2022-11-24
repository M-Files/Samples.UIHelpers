﻿using MFiles.VAF.Common;
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
                DefaultLocation = this.Configuration?.AdvancedConfiguration?.DefaultLocation ?? WindowLocation.BottomPane
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
