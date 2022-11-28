using MFiles.VAF.Configuration;
using System;
using System.Runtime.Serialization;

namespace UIHelpers
{
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    [UsesResources(typeof(Resources.UIResources))]
    public abstract class TranslationBase
    {

        [DataMember(Order = Int32.MaxValue - 21)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Save_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Save_HelpText),
            DefaultValue = "Save"
        )]
        public string Buttons_Save { get; set; }

        [DataMember(Order = Int32.MaxValue - 20)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Close_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Close_HelpText),
            DefaultValue = "Close"
        )]
        public string Buttons_Close { get; set; }

        [DataMember(Order = Int32.MaxValue - 19)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Discard_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_Buttons_Discard_HelpText),
            DefaultValue = "Discard"
        )]
        public string Buttons_Discard { get; set; }

        [DataMember(Order = Int32.MaxValue - 18)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowBelowListing_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowBelowListing_HelpText),
            DefaultValue = "Show below the listing"
        )]
        public string Location_ShowBelowListing { get; set; }

        [DataMember(Order = Int32.MaxValue - 17)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowInTabOnRight_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowInTabOnRight_HelpText),
            DefaultValue = "Show in tab on right"
        )]
        public string Location_ShowInTabOnRight { get; set; }

        [DataMember(Order = Int32.MaxValue - 16)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowInPopOutWindow_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.UI_Commands_ShowInPopOutWindow_HelpText),
            DefaultValue = "Show in a pop-out window"
        )]
        public string Location_ShowInPopOutWindow { get; set; }

        public abstract string CommandText { get; set; }
        public abstract string TabTitle { get; set; }
    }
}