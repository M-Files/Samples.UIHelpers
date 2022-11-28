using MFiles.VAF.Configuration;

namespace UIHelpers
{
    public enum WindowLocation
    {
        [JsonConfEditor(Label = ResourceMarker.Id + nameof(Resources.Configuration.Location_BottomPane))]
        BottomPane = 0,

        [JsonConfEditor(Label = ResourceMarker.Id + nameof(Resources.Configuration.Location_NewTab))]
        NewTab = 1,

        [JsonConfEditor(Label = ResourceMarker.Id + nameof(Resources.Configuration.Location_PopOut))]
        PopOut = 2
    }
}