using MFiles.VAF.Configuration;
using MFilesAPI;
using System.Reflection.Emit;
using System.Runtime.Serialization;
using UIHelpers.Modules.Base;

namespace UIHelpers.Modules.ShowPreview
{
    [DataContract]
    public class Configuration
        : ConfigurationBase<AdvancedConfiguration>
    {

        [DataMember(Order = 2)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.RequiredAccessRights_Label),
            Hidden = false,
            HideWhen = ".parent._children{.key == 'AccessRestrictionType' && .value != 'ByVaultRights' }",
            DefaultValue = MFVaultAccess.MFVaultAccessNone
        )]
        public new MFVaultAccess RequiredAccessRights
        {
            get => base.RequiredAccessRights;
            set => base.RequiredAccessRights = value;
        }
    }
}