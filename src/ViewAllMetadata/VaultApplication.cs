using MFiles.VAF;
using MFiles.VAF.AppTasks;
using MFiles.VAF.Common;
using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.AdminConfigurations;
using MFiles.VAF.Configuration.Domain.Dashboards;
using MFiles.VAF.Core;
using MFilesAPI;
using System;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;

namespace ViewAllMetadata
{
    public class VaultApplication
        : MFiles.VAF.Extensions.ConfigurableVaultApplicationBase<Configuration>
    {
        /// <summary>
        /// The resource string provider to use.
        /// </summary>
        protected IResourceStringProvider ResourceStringProvider { get; set; }
            = new DefaultResourceStringProvider();

        #region Install the UIX application

        /// <inheritdoc />
        /// <remarks>Installs the UIX application.</remarks>
        protected override void InitializeApplication(Vault vault)
        {
            try
            {
                string appPath = "ViewAllMetadata.UIX.mfappx";
                if (System.IO.File.Exists(appPath))
                {
                    vault.CustomApplicationManagementOperations.InstallCustomApplication(appPath);
                }
                else
                {
                    this.Logger?.Fatal($"Could not install View all Metadata UIX application; {appPath} does not exist.");
                }
            }
            catch (Exception ex)
            {
                if (!MFUtils.IsMFilesAlreadyExistsError(ex))
                    this.Logger?.Fatal(ex, $"Could not install  View all Metadata UIX application.");
            }

            base.InitializeApplication(vault);
        }

        #endregion

        /// <summary>
        /// Registers a Vault Extension Method with name "ViewAllMetadata.GetUIXConfiguration".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("ViewAllMetadata.GetUIXConfiguration",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string GetUIXConfiguration(EventHandlerEnvironment env)
        {
            // Create and populate the configuration.
            var configuration = new UIXConfiguration()
            {
                // Create the resource strings from the provider, or default to none.
                ResourceStrings =
                    this.ResourceStringProvider?.Create
                    (
                        env.Input.ToLower(),
                        this.Configuration?.LanguageOverrides?.ToArray()
                    )
                    ?? new ResourceStrings()
            };

            // Serialize the configuration for use in the UIX application.
            return Newtonsoft.Json.JsonConvert.SerializeObject(configuration);
        }

        /// <summary>
        /// Registers a Vault Extension Method with name "ViewAllMetadata.ShouldShowAllMetadata".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("ViewAllMetadata.ShouldShowAllMetadata",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string ShouldShowAllMetadata(EventHandlerEnvironment env)
        {
            // Do we have any specific users allowed access?
            if (null != this.Configuration?.UserConfiguration?.AllowedUsers)
            {
                // If this user is specified then allow access.
                var users = this
                    .Configuration
                    .UserConfiguration
                    .AllowedUsers
                    .Where(u => u != null)
                    .Select(u => u.Resolve(env.Vault, typeof(UserAccount)));
                if (users.Any(u => u.ID == env.CurrentUserID))
                    return true.ToString();
            }

            // Do we have any specific user groups access?
            if (null != this.Configuration?.UserConfiguration?.AllowedUserGroups)
            {
                // If this user is specified then allow access.
                var groups = this
                    .Configuration
                    .UserConfiguration
                    .AllowedUserGroups
                    .Where(u => u != null)
                    .Select(u => u.Resolve(env.Vault, typeof(UserGroup)));
                if (groups.Any(g => env.CurrentUserSessionInfo.UserAndGroupMemberships.GetUserOrUserGroupIDIndex(g.ID, MFUserOrUserGroupType.MFUserOrUserGroupTypeUserGroup) > -1))
                    return true.ToString();
            }

            // Nope.
            return false.ToString();
        }

        /// <inheritdoc />
        /// <remarks>This does not use any async operations, so hide it.</remarks>
        public override IDashboardContent GetAsynchronousOperationDashboardContent
        (
            IConfigurationRequestContext context
        )
        {
            return null;
        }

    }
}