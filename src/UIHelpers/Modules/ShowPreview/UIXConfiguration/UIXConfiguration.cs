using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace UIHelpers.ShowPreview
{
    [DataContract]
    public class UIXConfiguration
    {
        [DataMember]
        public ResourceStrings ResourceStrings { get; set; }
            = new ResourceStrings();

        [DataMember]
        public WindowLocation DefaultLocation { get; set; }
            = WindowLocation.BottomPane;

        [DataMember]
        public WindowLocation[] AllowedLocations { get; set; } 
            = new []
            {
                WindowLocation.BottomPane,
                WindowLocation.PopOut
            };
    }
}