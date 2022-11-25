using NLog.Config;
using System.Runtime.Serialization;

namespace UIHelpers.Modules.Base
{
    [DataContract]
    public class UIXConfigurationBase
    {
        [DataMember]
        public ResourceStrings ResourceStrings { get; set; }
            = new ResourceStrings();

        [DataMember]
        public bool EnableEditing { get; set; }

        [DataMember]
        public WindowLocation DefaultLocation { get; set; }
            = AdvancedConfigurationBase.DefaultLocationDefault;

        [DataMember]
        public WindowLocation[] AllowedLocations { get; set; } 
            = new []
            {
                WindowLocation.BottomPane,
                WindowLocation.NewTab,
                WindowLocation.PopOut
            };

        [DataMember]
        public int PopupWindowHeight { get; set; }
            = AdvancedConfigurationBase.DefaultPopupWindowHeightDefault;

        [DataMember]
        public int PopupWindowWidth { get; set; }
            = AdvancedConfigurationBase.DefaultPopupWindowWidthDefault;

        [DataMember]
        public int CommandLocation { get; set; }

        [DataMember]
        public int CommandPriority { get; set; }
    }
}