using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ViewAllMetadata
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
        public Location DefaultLocation { get; set; }
            = Location.BottomPane;
        [DataMember]
        public Location[] AllowedLocations { get; set; } 
            = new []
            {
                Location.BottomPane
            };
    }
}