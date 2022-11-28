using MFilesAPI;
using UIHelpers.Locations.WindowLocations;

namespace UIHelpers.Modules.Base
{
    internal interface ISuppliesUIXConfiguration
    {
        bool ShouldShow(Vault vault, SessionInfo sessionInfo);
        object GetUIXConfiguration(string language, IWindowLocationRepository windowLocationRepository);
    }
}
