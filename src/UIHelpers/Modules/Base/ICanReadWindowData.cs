using MFilesAPI;

namespace UIHelpers.Modules.Base
{
    /// <summary>
    /// Notes that the module can read state of a window.
    /// </summary>
    internal interface ICanReadWindowData
    {
        /// <summary>
        /// Reads the state of a window, typically from the vault, for the current user.
        /// </summary>
        /// <param name="vault">The vault to read from.</param>
        /// <param name="advancedConfiguration">The configuration containing fallback values.</param>
        /// <param name="location">The window location being requested.</param>
        /// <param name="height">The height of the window.</param>
        /// <param name="width">The width of the window.</param>
        void GetWindowData
        (
            Vault vault, 
            AdvancedConfigurationBase advancedConfiguration, 
            out WindowLocation location, 
            out int height, 
            out int width
        );
    }
}
