using MFilesAPI;
using System;
using UIHelpers.Modules.Base;

namespace UIHelpers.Locations.WindowLocations
{
    public interface IWindowLocationRepository
    {
        /// <summary>
        /// Reads the state of a window, typically from the vault, for the current user.
        /// </summary>
        /// <param name="vault">The vault to read from.</param>
        /// <param name="module">The module this is for.</param>
        /// <param name="advancedConfiguration">The configuration containing fallback values.</param>
        /// <param name="location">The window location being requested.</param>
        /// <param name="height">The height of the window.</param>
        /// <param name="width">The width of the window.</param>
        void GetWindowLocationForCurrentUser
        (
            Vault vault,
            ModuleBase module,
            AdvancedConfigurationBase advancedConfiguration,
            out WindowLocation location,
            out int height,
            out int width
        );

        /// <summary>
        /// Saves the state of a window, typically to the vault, for the current user.
        /// </summary>
        /// <param name="vault">The vault to save to.</param>
        /// <param name="module">The module this is for.</param>
        /// <param name="location">The window location being saved.</param>
        /// <param name="height">The height of the window.</param>
        /// <param name="width">The width of the window.</param>
        void SetWindowLocationForCurrentUser
        (
            Vault vault,
            ModuleBase module,
            WindowLocation location, 
            int height, 
            int width
        );

    }
    internal class WindowLocationRepository
        : IWindowLocationRepository
    {
        /// <inheritdoc />
        public void GetWindowLocationForCurrentUser
        (
            Vault vault,
            ModuleBase module,
            AdvancedConfigurationBase advancedConfiguration, 
            out WindowLocation location, 
            out int height,
            out int width
        )
        {
            // Sanity.
            if (null == vault)
                throw new ArgumentNullException(nameof(vault));
            if (null == module)
                throw new ArgumentNullException(nameof(module));
            if (null == advancedConfiguration)
                throw new ArgumentNullException(nameof(advancedConfiguration));

            // Get the named values.
            var type = MFNamedValueType.MFUserDefinedValue;
            var ns = module.GetType().FullName + ".WindowData";
            var namedValues = vault.NamedValueStorageOperations.GetNamedValues
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
            Vault vault,
            ModuleBase module,
            WindowLocation location, 
            int height, 
            int width
        )
        {
            // Sanity.
            if (null == vault)
                throw new ArgumentNullException(nameof(vault));
            if (null == module)
                throw new ArgumentNullException(nameof(module));

            // Get the named values.
            var type = MFNamedValueType.MFUserDefinedValue;
            var ns = module.GetType().FullName + ".WindowData";
            var namedValues = vault.NamedValueStorageOperations.GetNamedValues
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
            vault.NamedValueStorageOperations.SetNamedValues
            (
                type,
                ns,
                namedValues
            );
        }
    }
}
