using System;
using System.Runtime.Serialization;

namespace ViewAllMetadata
{
    [DataContract]
    public class UIXConfiguration
    {
        [DataMember]
        public ResourceStrings ResourceStrings { get; set; }
            = new ResourceStrings();
    }
}