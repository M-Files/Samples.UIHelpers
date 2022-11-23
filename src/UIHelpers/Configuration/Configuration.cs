using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.AdminConfigurations;
using MFiles.VAF.Configuration.JsonAdaptor;
using MFiles.VAF.Configuration.JsonEditor;
using MFiles.VAF.Extensions.Configuration;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Resources;
using System.Runtime.Serialization;
using UIHelpers.ViewAllMetadata;

namespace UIHelpers
{
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    [UsesResources(typeof(Resources.UIResources))]
    public class Configuration
        : ConfigurationBase, ICanPerformCustomValidation
    {
        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.ViewAllMetadata_Label),
            DefaultValue = "Disabled"
        )]
        public ViewAllMetadata.Configuration ViewAllMetadata { get; set; }
            = new ViewAllMetadata.Configuration();

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.ShowPreview_Label),
            DefaultValue = "Disabled"
        )]
        public ShowPreview.Configuration ShowPreview { get; set; }
            = new ShowPreview.Configuration();

        [DataMember(Order = Int32.MaxValue)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.Advanced_Label)
        )]
        public AdvancedConfiguration AdvancedConfiguration { get; set; }
            = new AdvancedConfiguration();

        /// <inheritdoc />
        /// <remarks>Delegates to <see cref="AdvancedConfiguration.CustomValidation(Vault)"/></remarks>
        public IEnumerable<ValidationFinding> CustomValidation(Vault vault)
        {
            foreach (var vf in this.ViewAllMetadata?.CustomValidation(vault) ?? Enumerable.Empty<ValidationFinding>())
                yield return vf;
            foreach (var vf in this.ShowPreview?.CustomValidation(vault) ?? Enumerable.Empty<ValidationFinding>())
                yield return vf;
        }
    }
}