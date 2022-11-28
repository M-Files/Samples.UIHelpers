using MFilesAPI;

namespace UIHelpers.Modules.Base
{
    /// <summary>
    /// Notes that the module can save state of a window.
    /// </summary>
    internal interface ICanWriteWindowData
    {
        /// <summary>
        /// Saves the state of a window, typically to the vault, for the current user.
        /// </summary>
        /// <param name="vault">The vault to save to.</param>
        /// <param name="location">The window location being saved.</param>
        /// <param name="height">The height of the window.</param>
        /// <param name="width">The width of the window.</param>
        void PersistWindowData(Vault vault, WindowLocation location, int height, int width);
    }
}
