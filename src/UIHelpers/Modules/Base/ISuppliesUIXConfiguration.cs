using MFilesAPI;

namespace UIHelpers.Modules.Base
{
    internal interface ISuppliesUIXConfiguration
    {
        bool ShouldShow(Vault vault, SessionInfo sessionInfo);
        object GetUIXConfiguration(string language);
    }
}
