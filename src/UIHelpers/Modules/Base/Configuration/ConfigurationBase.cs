using MFiles.VAF.Configuration;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace UIHelpers.Modules.Base
{
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    [UsesResources(typeof(Resources.UIResources))]
    public class ConfigurationBase
        : ICanPerformCustomValidation
    {

        [DataMember(Order = 0)]
        public bool Enabled { get; set; }

        [DataMember(Order = 1)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.AccessRestrictionType_Label),
            DefaultValue = AccessRestrictionType.ByVaultRights
        )]
        public AccessRestrictionType AccessRestrictionType { get; set; }
            = AccessRestrictionType.ByVaultRights;

        [DataMember(Order = 2)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.RequiredAccessRights_Label),
            Hidden = false,
            HideWhen = ".parent._children{.key == 'AccessRestrictionType' && .value != 'ByVaultRights' }",
            DefaultValue = MFVaultAccess.MFVaultAccessChangeFullControlRole
        )]
        public MFVaultAccess RequiredAccessRights { get; set; }
            = MFVaultAccess.MFVaultAccessChangeFullControlRole;

        [DataMember(Order = 2)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.UserConfiguration_Label),
            Hidden = true,
            ShowWhen = ".parent._children{.key == 'AccessRestrictionType' && .value == 'Custom' }"
        )]
        public CustomAccessRestrictionTypeConfiguration CustomAccessRestrictionTypeConfiguration { get; set; } 
            = new CustomAccessRestrictionTypeConfiguration();

        /// <inheritdoc />
        /// <remarks>Delegates to <see cref="AdvancedConfigurationBase.CustomValidation(Vault)"/></remarks>
        public virtual IEnumerable<ValidationFinding> CustomValidation(Vault vault)
            => Enumerable.Empty<ValidationFinding>();

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
                        if (null != this.CustomAccessRestrictionTypeConfiguration?.AllowedUsers)
                        {
                            // If this user is specified then allow access.
                            var users = this
                                .CustomAccessRestrictionTypeConfiguration
                                .AllowedUsers
                                .Where(u => u != null)
                                .Select(u => u.Resolve(vault, typeof(UserAccount)));
                            if (users.Any(u => u.ID == sessionInfo.UserID))
                                return true;
                        }

                        // Do we have any specific user groups access?
                        if (null != this.CustomAccessRestrictionTypeConfiguration?.AllowedUserGroups)
                        {
                            // If this user is specified then allow access.
                            var groups = this
                                .CustomAccessRestrictionTypeConfiguration
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
                        if (this.RequiredAccessRights == MFVaultAccess.MFVaultAccessNone)
                            return true;
                        return sessionInfo.CheckVaultAccess(this.RequiredAccessRights);
                    }
            }
        }
    }
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    [UsesResources(typeof(Resources.UIResources))]
    public class ConfigurationBase<TAdvancedConfiguration>
        : ConfigurationBase
        where TAdvancedConfiguration : AdvancedConfigurationBase, new()
    {
        [DataMember(Order = Int32.MaxValue)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.Advanced_Label)
        )]
        public TAdvancedConfiguration AdvancedConfiguration { get; set; }
            = new TAdvancedConfiguration();

        /// <inheritdoc />
        /// <remarks>Delegates to <see cref="AdvancedConfigurationBase.CustomValidation(Vault)"/></remarks>
        public override IEnumerable<ValidationFinding> CustomValidation(Vault vault)
        {
            foreach (var vf in base.CustomValidation(vault) ?? Enumerable.Empty<ValidationFinding>())
                yield return vf;
            foreach (var vf in this.AdvancedConfiguration?.CustomValidation(vault) ?? Enumerable.Empty<ValidationFinding>())
                yield return vf;
        }

    }
}