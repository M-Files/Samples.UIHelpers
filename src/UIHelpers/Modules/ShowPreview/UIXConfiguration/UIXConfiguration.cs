using System.Runtime.Serialization;

namespace UIHelpers.Modules.ShowPreview
{
    [DataContract]
    public class UIXConfiguration
        : Base.UIXConfigurationBase
    {
        public UIXConfiguration()
        {
            base.AllowedLocations = new[]
            {
                WindowLocation.BottomPane,
                WindowLocation.PopOut
            };
        }
    }
}