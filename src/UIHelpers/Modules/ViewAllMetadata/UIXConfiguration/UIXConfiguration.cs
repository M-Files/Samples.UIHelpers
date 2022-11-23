using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace UIHelpers.ViewAllMetadata
{
    [DataContract]
    public class UIXConfiguration
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
                WindowLocation.BottomPane
            };
    }
}