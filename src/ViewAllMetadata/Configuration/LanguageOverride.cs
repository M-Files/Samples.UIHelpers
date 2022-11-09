using MFiles.VAF.Configuration;
using System.Runtime.Serialization;

namespace ViewAllMetadata
{
    [DataContract]
    [JsonConfEditor(NameMember = nameof(LanguageOverride.Language))]
    public class LanguageOverride
    {
        [DataMember]
        [JsonConfEditor(TypeEditor = "options")]
        [ValueOptions(typeof(LanguageStableValueOptionsProvider))]
        public string Language { get; set; }

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowAllMetadata_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowAllMetadata_HelpText)
        )]
        public string Commands_ShowAllMetadata { get; set; }

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Close_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Close_HelpText)
        )]
        public string Buttons_Close { get; set; }
    }
}