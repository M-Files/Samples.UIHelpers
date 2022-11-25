using MFiles.VAF.Configuration;
using System.Collections.Generic;
using System.Runtime.Serialization;
using UIHelpers.Locations;
using UIHelpers.Modules.Base;

namespace UIHelpers.Modules.ViewAllMetadata
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
        [ValueOptions(typeof(LocationProvider.ViewAllMetadataLocationProvider))]
        public override WindowLocation DefaultLocation { get; set; }
            = DefaultLocationDefault;

        [DataMember(Order = 1)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.ConfiguredLocations_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.ConfiguredLocations_HelpText)
        )]
        [ObjectMembers(typeof(LocationProvider.ViewAllMetadataLocationProvider))]
        public override Dictionary<string, bool> ConfiguredLocations { get; set; }
            = new Dictionary<string, bool>();

        [DataMember(Order = 4)]
        [JsonConfIntegerEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.CommandPriority_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.CommandPriority_HelpText),
            DefaultValue = 1,
            Min = 1
        )]
        public override int CommandPriority { get; set; } = 1;

        /// <inheritdoc />
        protected override LocationProvider GetLocationProvider()
            => new LocationProvider.ViewAllMetadataLocationProvider();
    }
}