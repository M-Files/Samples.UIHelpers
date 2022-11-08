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
        [JsonConfEditor(Label = "Show all metadata", HelpText = "Command button text, shown in the context menu")]
        public string Commands_ShowAllMetadata { get; set; }
    }
}