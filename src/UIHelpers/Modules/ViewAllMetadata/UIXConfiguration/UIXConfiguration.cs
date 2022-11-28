using System.Runtime.Serialization;

namespace UIHelpers.Modules.ViewAllMetadata
{
    [DataContract]
    public class UIXConfiguration
        : Base.UIXConfigurationBase
    {
        [DataMember]
        public bool EnableEditing { get; set; }
    }
}