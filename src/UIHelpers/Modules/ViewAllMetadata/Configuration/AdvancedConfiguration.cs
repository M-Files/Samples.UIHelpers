﻿using MFiles.VAF.Configuration;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace UIHelpers.ViewAllMetadata
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
        [ValueOptions(typeof(LocationProvider.ViewAllMetadataLocationProvider))]
        public WindowLocation DefaultLocation { get; set; }
            = WindowLocation.BottomPane;

        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.ConfiguredLocations_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.ConfiguredLocations_HelpText)
        )]
        [ObjectMembers(typeof(LocationProvider.ViewAllMetadataLocationProvider))]
        public Dictionary<string, bool> ConfiguredLocations { get; set; }
            = new Dictionary<string, bool>();

        public IEnumerable<WindowLocation> AllowedLocations
        {
            get
            {
                var provider = new LocationProvider.ViewAllMetadataLocationProvider();
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