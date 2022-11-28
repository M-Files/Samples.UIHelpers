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
        /// <summary>
        /// An implementation of <see cref="WindowLocationOptionsProvider" that provides data
        /// for this module.
        /// </summary>
        public class ShowPreviewWindowLocationOptionsProvider
            : WindowLocationOptionsProvider
        {
            public ShowPreviewWindowLocationOptionsProvider()
                : base
                (
                    new[] { WindowLocation.BottomPane, WindowLocation.PopOut },
                    new WindowLocation[0]
                )
            {

            }
        }

        [DataMember(Order = 0)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.DefaultLocation_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.DefaultLocation_HelpText),
            DefaultValue = DefaultLocationDefault
        )]
        [ValueOptions(typeof(ShowPreviewWindowLocationOptionsProvider))]
        public override WindowLocation DefaultLocation { get; set; }
            = DefaultLocationDefault;

        [DataMember(Order = 1)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.ConfiguredLocations_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.ConfiguredLocations_HelpText)
        )]
        [ObjectMembers(typeof(WindowLocationOptionsProvider.ShowPreviewWindowLocationOptionsProvider))]
        public override Dictionary<string, bool> ConfiguredLocations { get; set; }
            = new Dictionary<string, bool>();

        [DataMember(Order = 4)]
        [JsonConfIntegerEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.CommandPriority_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.CommandPriority_HelpText),
            DefaultValue = 2,
            Min = 1
        )]
        public override int CommandPriority { get; set; } = 2;

        /// <inheritdoc />
        protected override WindowLocationOptionsProvider GetLocationProvider()
            => new WindowLocationOptionsProvider.ShowPreviewWindowLocationOptionsProvider();
    }
}