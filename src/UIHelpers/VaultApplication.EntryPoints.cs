using MFiles.VAF.Common;
using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.AdminConfigurations;
using MFiles.VAF.Configuration.Domain.Dashboards;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using UIHelpers.Locations.WindowLocations;
using UIHelpers.Modules.Base;

namespace UIHelpers
{
    public partial class VaultApplication
        : MFiles.VAF.Extensions.ConfigurableVaultApplicationBase<Configuration>
    {

        #region Retrieve UIX configuration for a given module

        /// <summary>
        /// Registers a Vault Extension Method with name "UIHelpers.GetUIXConfiguration".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// This method retrieves the UIX configuration for a specific module.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("UIHelpers.GetUIXConfiguration",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string GetUIXConfiguration(EventHandlerEnvironment env)
        {
            try
            {
                // Load and validate the input.
                var input = Newtonsoft.Json.JsonConvert.DeserializeObject<GetUIXConfigurationVEMInput>(env.Input);
                if (null == input)
                    throw new ArgumentException("Environment input invalid", nameof(env));
                var module = this.GetModule<ISuppliesUIXConfiguration>(input.Module);
                if (null == module)
                    throw new ArgumentException($"Module {input.Module} not found", nameof(env));

                // Return the config data.
                return Newtonsoft.Json.JsonConvert.SerializeObject
                (
                    module.GetUIXConfiguration(input.Language, this.GetWindowLocationRepository())
                );
            }
            catch (Exception e)
            {
                this.Logger?.Error(e, $"Could not get UIX configuration from input.");
            }
            return "Invalid input";
        }

        #endregion

        #region Persist window location for module

        /// <summary>
        /// Gets the window location repository to use.
        /// </summary>
        /// <returns></returns>
        internal virtual IWindowLocationRepository GetWindowLocationRepository()
            => new WindowLocationRepository();

        /// <summary>
        /// Registers a Vault Extension Method with name "UIHelpers.PersistWindowData".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// This method saves the current window data for the user so that it'll open again here next time.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("UIHelpers.PersistWindowData",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string PersistWindowData(EventHandlerEnvironment env)
        {
            try
            {
                // Load and validate the input.
                var input = Newtonsoft.Json.JsonConvert.DeserializeObject<PersistWindowDataVEMInput>(env.Input);
                if (null == input)
                    throw new ArgumentException("Environment input invalid", nameof(env));
                var module = this.GetModule(input.Module);
                if (null == module)
                    throw new ArgumentException($"Module {input.Module} not found", nameof(env));

                // Persist the window data.
                this.GetWindowLocationRepository()
                    .SetWindowLocationForCurrentUser
                    (
                        env.Vault,
                        module,
                        input.Location,
                        input.Height,
                        input.Width
                    );
                return "true";
            }
            catch (Exception e)
            {
                this.Logger?.Error(e, $"Could not get window data from input.");
            }
            return "Invalid input";
        }

        #endregion

        #region Return whether the UI should show for a given module

        /// <summary>
        /// Registers a Vault Extension Method with name "UIHelpers.ShouldShow".
        /// Users must have at least MFVaultAccess.MFVaultAccessNone access to execute the method.
        /// This method retrieves whether a specific module should be shown.
        /// </summary>
        /// <param name="env">The vault/object environment.</param>
        /// <returns>The any output from the vault extension method execution.</returns>
        /// <remarks>The input to the vault extension method is available in <see cref="EventHandlerEnvironment.Input"/>.</remarks>
        [VaultExtensionMethod("UIHelpers.ShouldShow",
            RequiredVaultAccess = MFVaultAccess.MFVaultAccessNone)]
        private string ShouldShow(EventHandlerEnvironment env)
        {
            try
            {
                // Load and validate the input.
                var input = Newtonsoft.Json.JsonConvert.DeserializeObject<VEMInputBase>(env.Input);
                if (null == input)
                    throw new ArgumentException("Environment input invalid", nameof(env));
                var module = this.GetModule<ISuppliesUIXConfiguration>(input.Module);
                if (null == module)
                    throw new ArgumentException($"Module {input.Module} not found", nameof(env));

                // Identify whether this module should show for this user.
                return module.ShouldShow(env.Vault, env.CurrentUserSessionInfo).ToString()?.ToLower();
            }
            catch (Exception e)
            {
                this.Logger?.Error(e, $"Could not get data from input.");
            }
            return "Invalid input";
        }

        #endregion

    }
}