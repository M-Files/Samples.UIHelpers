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
            = WindowLocation.BottomPane;

        [DataMember]
        public WindowLocation[] AllowedLocations { get; set; } 
            = new []
            {
                WindowLocation.BottomPane,
                WindowLocation.NewTab,
                WindowLocation.PopOut
            };
    }
}