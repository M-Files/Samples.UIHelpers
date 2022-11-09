using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.JsonAdaptor;
using MFiles.VAF.Extensions.Configuration;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;
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
            Label = "Access Restriction Type",
            DefaultValue = AccessRestrictionType.ByVaultRights
        )]
        public AccessRestrictionType AccessRestrictionType { get; set; } 
            = AccessRestrictionType.ByVaultRights;

        [DataMember]
        [JsonConfEditor
        (
            Label = "Required Access Rights",
            Hidden = false,
            HideWhen = ".parent._children{.key == 'AccessRestrictionType' && .value != 'ByVaultRights' }",
            DefaultValue = MFVaultAccess.MFVaultAccessChangeFullControlRole
        )]
        public MFVaultAccess AccessRights { get; set; }
            = MFVaultAccess.MFVaultAccessChangeFullControlRole;

        [DataMember]
        [JsonConfEditor
        (
            Label = "User Configuration",
            Hidden = true,
            ShowWhen = ".parent._children{.key == 'AccessRestrictionType' && .value == 'Custom' }"
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

        /// <summary>
        /// Checks whether the user with session info <paramref name="sessionInfo"/> is allowed
        /// access according to the current configuration.
        /// </summary>
        /// <param name="vault">The vault to use to check access.</param>
        /// <param name="sessionInfo">The user's current session.</param>
        /// <returns><see langword="true"/> if the user can access this application, <see langword="false"/> otherwise.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="sessionInfo"/> or <paramref name="vault"/> are null.</exception>
        public bool UserIsAllowedAccess(Vault vault, SessionInfo sessionInfo)
        {
            if (null == vault)
                throw new ArgumentNullException(nameof(vault));
            if (null == sessionInfo)
                throw new ArgumentNullException(nameof(sessionInfo));

            switch (this.AccessRestrictionType)
            {
                case AccessRestrictionType.Custom:
                    {

                        // Do we have any specific users allowed access?
                        if (null != this.UserConfiguration?.AllowedUsers)
                        {
                            // If this user is specified then allow access.
                            var users = this
                                .UserConfiguration
                                .AllowedUsers
                                .Where(u => u != null)
                                .Select(u => u.Resolve(vault, typeof(UserAccount)));
                            if (users.Any(u => u.ID == sessionInfo.UserID))
                                return true;
                        }

                        // Do we have any specific user groups access?
                        if (null != this.UserConfiguration?.AllowedUserGroups)
                        {
                            // If this user is specified then allow access.
                            var groups = this
                                .UserConfiguration
                                .AllowedUserGroups
                                .Where(u => u != null)
                                .Select(u => u.Resolve(vault, typeof(UserGroup)));
                            if (groups.Any(g => sessionInfo.UserAndGroupMemberships.GetUserOrUserGroupIDIndex(g.ID, MFUserOrUserGroupType.MFUserOrUserGroupTypeUserGroup) > -1))
                                return true;
                        }

                        // Nope.
                        return false;
                    }
                default:
                    {
                        return sessionInfo.CheckVaultAccess(this.AccessRights);
                    }
            }
        }
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