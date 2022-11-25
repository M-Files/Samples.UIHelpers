using MFiles.VAF.Common;
using MFilesAPI;
using System.Linq;
using UIHelpers.Modules.Base;

namespace UIHelpers.Modules.ShowPreview
{
    internal class Module
        : ModuleBase<Configuration, UIXConfiguration>
    {
        /// <inheritdoc />
        public override Configuration GetTypedConfiguration() 
            => this.VaultApplication?.Configuration?.ShowPreview;

        public Module(VaultApplication vaultApplication) 
            : base(vaultApplication)
        {
            this.UIXApplicationPaths.Add("ShowPreview.UIX.mfappx");
        }
    }
}
