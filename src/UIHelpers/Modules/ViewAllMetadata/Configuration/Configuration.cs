using MFiles.VAF.Configuration;
using System.Runtime.Serialization;
using UIHelpers.Modules.Base;

namespace UIHelpers.Modules.ViewAllMetadata
{
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    [UsesResources(typeof(Resources.UIResources))]
    public class Configuration
        : ConfigurationBase<AdvancedConfiguration, Translation>
    {
       [DataMember]
       [JsonConfEditor
       (
           Label = ResourceMarker.Id + nameof(Resources.Configuration.EnableEditing_Label),
           DefaultValue = false
       )]
        public bool EnableEditing { get; set; }
    }
}