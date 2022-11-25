using MFiles.VAF.Common;
using MFilesAPI;
using System.Linq;
using UIHelpers.Modules.Base;

namespace UIHelpers.Modules.ViewAllMetadata
{
    internal class Module
        : ModuleBase<Configuration, UIXConfiguration>
    {
        /// <inheritdoc />
        public override Configuration GetTypedConfiguration()
            => this.VaultApplication?.Configuration?.ViewAllMetadata;

        public Module(VaultApplication vaultApplication) 
            : base(vaultApplication)
        {
            this.UIXApplicationPaths.Add("ViewAllMetadata.UIX.mfappx");
        }

        protected override void PopulateUIXConfiguration
        (
            string language,
            UIXConfiguration uixConfiguration
        )
        {
            var config = this.GetTypedConfiguration();
            base.PopulateUIXConfiguration(language, uixConfiguration);
            uixConfiguration.EnableEditing = config?.EnableEditing ?? false;
        }

    }
}
