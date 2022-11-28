using MFiles.VAF.Configuration;
using System.Runtime.Serialization;

namespace UIHelpers.Modules.ViewAllMetadata
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
            DefaultValue = "Raw metadata"
        )]
        public override string TabTitle { get; set; } = "Raw metadata";

        [DataMember(Order = 1001)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.CommandText_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.CommandText_HelpText),
            DefaultValue = "Show all metadata"
        )]
        public override string CommandText { get; set; } = "Show all metadata";
    }
}