using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.JsonAdaptor;
using MFiles.VAF.Extensions.Configuration;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ViewAllMetadata
{
    [DataContract]
    public class Configuration
        : ConfigurationBase
    {
        [DataMember]
        [JsonConfEditor
        (
            Label = "User Configuration",
            DefaultValue = "No users can access this"
        )]
        public UserConfiguration UserConfiguration { get; set; } = new UserConfiguration();

        [DataMember]
        [JsonConfEditor
        (
            Label = "Languages",
            ChildName = "Language"
        )]
        // TODO: In future versions of the VAF we can use ObjectMembersAttribute!
        public List<LanguageOverride> LanguageOverrides { get; set; } = new List<LanguageOverride>();
    }

    [DataContract]
    public class UserConfiguration
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
            Label = "Allowed Users",
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
            Label = "Allowed User Groups",
            IsRequired = false
        )]
        public List<MFIdentifier> AllowedUserGroups { get; set; } = new List<MFIdentifier>();
    }
}