using MFiles.VAF.Configuration;
using System.Runtime.Serialization;

namespace UIHelpers.Modules.ShowPreview
{
    [DataContract]
    public class Translation
        : TranslationBase
    {

        [DataMember(Order = 1000)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.TabTitle_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.TabTitle_HelpText),
            DefaultValue = "Preview"
        )]
        public override string TabTitle { get; set; } = "Preview";

        [DataMember(Order = 1001)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.CommandText_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.CommandText_HelpText),
            DefaultValue = "Show (separate) preview"
        )]
        public override string CommandText { get; set; } = "Show (separate) preview";
    }
}