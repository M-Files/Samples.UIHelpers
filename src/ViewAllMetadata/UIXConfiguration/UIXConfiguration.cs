using System;
using System.Runtime.Serialization;

namespace SeparatePreview
{
    [DataContract]
    public class UIXConfiguration
    {
        [DataMember]
        public ResourceStrings ResourceStrings { get; set; }
            = new ResourceStrings();

        [DataMember]
        public TaskPaneConfiguration TaskPaneConfiguration { get; set; }
    }
}