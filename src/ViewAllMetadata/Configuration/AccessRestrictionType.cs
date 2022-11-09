using MFiles.VAF.Configuration;

namespace ViewAllMetadata
{
    public enum AccessRestrictionType
    {
        [JsonConfEditor(Label = ResourceMarker.Id + nameof(Resources.Configuration.AccessRestrictionType_ByVaultRights))]
        ByVaultRights = 0,

        [JsonConfEditor(Label = ResourceMarker.Id + nameof(Resources.Configuration.AccessRestrictionType_Custom))]
        Custom = 1
    }
}