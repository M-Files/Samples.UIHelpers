using MFiles.VAF.Configuration;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace UIHelpers.ShowPreview
{
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    public class AdvancedConfiguration
        : ICanPerformCustomValidation
    {
        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.DefaultLocation_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.DefaultLocation_HelpText),
            DefaultValue = WindowLocation.BottomPane
        )]
        [ValueOptions(typeof(LocationProvider.UIHelpersLocationProvider))]
        public WindowLocation DefaultLocation { get; set; }
            = WindowLocation.BottomPane;

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.ConfiguredLocations_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.ConfiguredLocations_HelpText)
        )]
        [ObjectMembers(typeof(LocationProvider.UIHelpersLocationProvider))]
        public Dictionary<string, bool> ConfiguredLocations { get; set; }
            = new Dictionary<string, bool>();

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.Languages_Label),
            ChildName = ResourceMarker.Id + nameof(Resources.Configuration.Languages_ChildName)
        )]
        [ObjectMembers(typeof(LanguageProvider))]
        public Dictionary<string, LanguageOverride> LanguageOverrides { get; set; }
            = new Dictionary<string, LanguageOverride>();

        public IEnumerable<WindowLocation> AllowedLocations
        {
            get
            {
                var provider = new LocationProvider.UIHelpersLocationProvider();
                return Enum.GetNames(typeof(WindowLocation))
                  .Select(n => new Tuple<string, WindowLocation, bool?>(n, (WindowLocation)Enum.Parse(typeof(WindowLocation), n), null))
                  .Where(n =>
                  {
                      // Is it explicitly configured?
                      if ((this.ConfiguredLocations?.ContainsKey(n.Item1) ?? false))
                          return this.ConfiguredLocations[n.Item1];

                      // Do we have a default?
                      if((provider.EnabledByDefault?.ContainsKey(n.Item2) ?? false))
                          return provider.EnabledByDefault[n.Item2];

                      // If it is hidden from the list then it should not be selectable.
                      if (provider.HiddenLocations.Contains(n.Item2))
                          return false;

                      // Nope; not available.
                      return false;
                  })
                  .Select(n => n.Item2);
            }
        }

        /// <inheritdoc />
        public IEnumerable<ValidationFinding> CustomValidation(Vault vault)
        {
            // If default location is not in allowed set then return an error.
            if ((this.AllowedLocations?.Any() ?? false)
                && false == this.AllowedLocations.Contains(this.DefaultLocation))
            {
                yield return new ValidationFinding(ValidationFindingType.Error, "/AdvancedConfiguration/DefaultLocation", "The default location is not in the list of allowed locations.");
            }
        }
    }
}