using MFilesAPI;

namespace UIHelpers.Modules.Base
{
    internal interface ICanSupplyWindowData
    {
        void GetWindowData(Vault vault, AdvancedConfigurationBase advancedConfiguration, out WindowLocation location, out int height, out int width);
    }
    internal interface ICanPersistWindowData
    {
        void PersistWindowData(Vault vault, WindowLocation location, int height, int width);
    }
}
