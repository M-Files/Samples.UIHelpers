using MFilesAPI;

namespace UIHelpers.Modules.Base
{
    internal interface ICanWriteWindowData
    {
        void PersistWindowData(Vault vault, WindowLocation location, int height, int width);
    }
}
