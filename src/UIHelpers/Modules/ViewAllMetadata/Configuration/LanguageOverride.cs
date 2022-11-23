using MFiles.VAF.Configuration;
using System.Runtime.Serialization;

namespace UIHelpers.ViewAllMetadata
{
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    [UsesResources(typeof(Resources.UIResources))]
    public class LanguageOverride
    {
        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowAllMetadata_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowAllMetadata_HelpText),
            DefaultValue = "Show all metadata"
        )]
        public string Commands_ShowAllMetadata { get; set; }

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Close_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Close_HelpText),
            DefaultValue = "Close"
        )]
        public string Buttons_Close { get; set; }

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Discard_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Discard_HelpText),
            DefaultValue = "Discard"
        )]
        public string Buttons_Discard { get; set; }

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Save_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Save_HelpText),
            DefaultValue = "Save"
        )]
        public string Buttons_Save { get; set; }

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowBelowListing_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowBelowListing_HelpText),
            DefaultValue = "Show below the listing"
        )]
        public string Location_ShowBelowListing { get; set; }

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowInTabOnRight_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowInTabOnRight_HelpText),
            DefaultValue = "Show in tab on right"
        )]
        public string Location_ShowInTabOnRight { get; set; }

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowInPopOutWindow_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowInPopOutWindow_HelpText),
            DefaultValue = "Show in a pop-out window"
        )]
        public string Location_ShowInPopOutWindow { get; set; }
    }
}