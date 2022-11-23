using MFiles.VAF.Configuration;
using MFilesAPI;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace UIHelpers.ViewAllMetadata
{
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    public class CustomAccessRestrictionTypeConfiguration
    {
        [DataMember(IsRequired = false)]
        [MFValueListItem
        (
            ValueList = (int)MFBuiltInValueList.MFBuiltInValueListUsers, 
            Validate = false, 
            AllowEmpty = true
        )]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.AllowedUsers_Label),
            IsRequired = false
       )]
        public List<MFIdentifier> AllowedUsers { get; set; } = new List<MFIdentifier>();

        [DataMember(IsRequired = false)]
        [MFUserGroup
        (
            Validate = false, 
            AllowEmpty = true
        )]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.AllowedUserGroups_Label),
            IsRequired = false
        )]
        public List<MFIdentifier> AllowedUserGroups { get; set; } = new List<MFIdentifier>();
    }
}