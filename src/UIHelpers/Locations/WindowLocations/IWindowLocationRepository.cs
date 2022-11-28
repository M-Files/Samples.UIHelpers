using UIHelpers.Modules.Base;

namespace UIHelpers.Locations.WindowLocations
{
    public interface IWindowLocationRepository
    {
        /// <summary>
        /// Reads the state of a window for the current user.
        /// </summary>
        /// <param name="module">The module this is for.</param>
        /// <param name="advancedConfiguration">The configuration containing fallback values.</param>
        /// <param name="location">The window location being requested.</param>
        /// <param name="height">The height of the window.</param>
        /// <param name="width">The width of the window.</param>
        void GetWindowLocationForCurrentUser
        (
            ModuleBase module,
            AdvancedConfigurationBase advancedConfiguration,
            out WindowLocation location,
            out int height,
            out int width
        );

        /// <summary>
        /// Saves the state of a window for the current user.
        /// </summary>
        /// <param name="module">The module this is for.</param>
        /// <param name="location">The window location being saved.</param>
        /// <param name="height">The height of the window.</param>
        /// <param name="width">The width of the window.</param>
        void SetWindowLocationForCurrentUser
        (
            ModuleBase module,
            WindowLocation location, 
            int height, 
            int width
        );

    }
}
