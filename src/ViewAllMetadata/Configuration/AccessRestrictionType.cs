using MFiles.VAF.Configuration;

namespace ViewAllMetadata
{
    public enum AccessRestrictionType
    {
        [JsonConfEditor(Label = "By vault access rights")]
        ByVaultRights = 0,

        [JsonConfEditor(Label = "Custom")]
        Custom = 1
    }
}