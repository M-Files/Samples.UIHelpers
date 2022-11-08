using MFiles.VAF.Configuration;
using System.Runtime.Serialization;

namespace SeparatePreview
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
        [JsonConfEditor(Label = "Open Preview", HelpText = "Command button text, shown in the task pane")]
        public string Commands_OpenPreviewWindow { get; set; }

        [DataMember]
        [JsonConfEditor(Label = "Please select a document", HelpText = "Shown in the window when no document is selected")]
        public string PreviewWindow_PleaseSelectADocument { get; set; }

        //[DataMember] The window doesn't show a dynamic title.  Skip for now.
        public string PreviewWindow_Title { get; set; }
    }
}