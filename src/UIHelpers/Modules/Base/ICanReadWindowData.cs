using MFilesAPI;

namespace UIHelpers.Modules.Base
{
    internal interface ICanReadWindowData
    {
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
