using MFiles.VAF.Configuration;
using System.Collections.Generic;
using System.Runtime.Serialization;
using UIHelpers.Modules.Base;

namespace UIHelpers.Modules.ShowPreview
{
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    public class AdvancedConfiguration
        : AdvancedConfigurationBase
    {
        [DataMember(Order = 0)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.DefaultLocation_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.DefaultLocation_HelpText),
            DefaultValue = DefaultLocationDefault
        )]
        [ValueOptions(typeof(LocationProvider.ShowPreviewLocationProvider))]
        public override WindowLocation DefaultLocation { get; set; }
            = DefaultLocationDefault;

        [DataMember(Order = 1)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.ConfiguredLocations_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.ConfiguredLocations_HelpText)
        )]
        [ObjectMembers(typeof(LocationProvider.ShowPreviewLocationProvider))]
        public override Dictionary<string, bool> ConfiguredLocations { get; set; }
            = new Dictionary<string, bool>();

        /// <inheritdoc />
        protected override LocationProvider GetLocationProvider()
            => new LocationProvider.ShowPreviewLocationProvider();
    }
}