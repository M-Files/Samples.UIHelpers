using MFilesAPI;
using System;
using UIHelpers.Modules.Base;

namespace UIHelpers.Locations.WindowLocations
{
    internal class VaultWindowLocationRepository
        : IWindowLocationRepository
    {
        protected Vault Vault { get; private set; }
        public VaultWindowLocationRepository(Vault vault)
        {
            Vault = vault 
                ?? throw new ArgumentNullException(nameof(vault));
        }
        /// <inheritdoc />
        public void GetWindowLocationForCurrentUser
        (
            ModuleBase module,
            AdvancedConfigurationBase advancedConfiguration, 
            out WindowLocation location, 
            out int height,
            out int width
        )
        {
            // Sanity.
            if (null == module)
                throw new ArgumentNullException(nameof(module));
            if (null == advancedConfiguration)
                throw new ArgumentNullException(nameof(advancedConfiguration));

            // Get the named values.
            var type = MFNamedValueType.MFUserDefinedValue;
            var ns = module.GetType().FullName + ".WindowData";
            var namedValues = this.Vault.NamedValueStorageOperations.GetNamedValues
            (
                type,
                ns
            ) ?? new NamedValues();

            // Set the defaults.
            location = advancedConfiguration?.DefaultLocation ?? AdvancedConfigurationBase.DefaultLocationDefault;
            height = advancedConfiguration?.DefaultPopupWindowHeight ?? AdvancedConfigurationBase.DefaultPopupWindowHeightDefault;
            width = advancedConfiguration?.DefaultPopupWindowWidth ?? AdvancedConfigurationBase.DefaultPopupWindowWidthDefault;

            // Can we parse out the location?
            if (namedValues.Contains("Location") && Enum.TryParse(namedValues["Location"]?.ToString(), out WindowLocation l))
                location = l;

            // Can we parse out the height?
            if (namedValues.Contains("Height") && Int32.TryParse(namedValues["Height"]?.ToString(), out int h) && h > 100)
                height = h;

            // Can we parse out the width?
            if (namedValues.Contains("Width") && Int32.TryParse(namedValues["Width"]?.ToString(), out int w) && w > 100)
                width = w;
        }

        /// <inheritdoc />
        public void SetWindowLocationForCurrentUser
        (
            ModuleBase module,
            WindowLocation location, 
            int height, 
            int width
        )
        {
            // Sanity.
            if (null == module)
                throw new ArgumentNullException(nameof(module));

            // Get the named values.
            var type = MFNamedValueType.MFUserDefinedValue;
            var ns = module.GetType().FullName + ".WindowData";
            var namedValues = this.Vault.NamedValueStorageOperations.GetNamedValues
            (
                type,
                ns
            ) ?? new NamedValues();

            // Set the data.
            namedValues["Location"] = (int)location;
            namedValues["Height"] = height > 100 ? height : 100;
            namedValues["Width"] = width > 100 ? width : 100;

            // If any are default then remove them.
            if (location == AdvancedConfigurationBase.DefaultLocationDefault)
                namedValues["Location"] = null;
            if (height == AdvancedConfigurationBase.DefaultPopupWindowHeightDefault)
                namedValues["Height"] = null;
            if (width == AdvancedConfigurationBase.DefaultPopupWindowWidthDefault)
                namedValues["Width"] = null;

            // Set the named values.
            this.Vault.NamedValueStorageOperations.SetNamedValues
            (
                type,
                ns,
                namedValues
            );
        }
    }
}
