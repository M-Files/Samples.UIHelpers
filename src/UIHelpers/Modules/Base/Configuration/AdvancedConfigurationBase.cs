﻿using MFiles.VAF.Configuration;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace UIHelpers.Modules.Base
{
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    public abstract class AdvancedConfigurationBase
        : ICanPerformCustomValidation
    {
        public const WindowLocation DefaultLocationDefault = WindowLocation.BottomPane;
        public abstract WindowLocation DefaultLocation { get; set; }
        public abstract Dictionary<string, bool> ConfiguredLocations { get; set; }

        public const int DefaultPopupWindowHeightDefault = 800;
        [DataMember]
        [JsonConfIntegerEditor(DefaultValue = DefaultPopupWindowHeightDefault, Min = 500, Max = 4000)]
        public int DefaultPopupWindowHeight { get; set; } = DefaultPopupWindowHeightDefault;

        public const int DefaultPopupWindowWidthDefault = 550;
        [DataMember]
        [JsonConfIntegerEditor(DefaultValue = DefaultPopupWindowWidthDefault, Min = 400, Max = 4000)]
        public int DefaultPopupWindowWidth { get; set; } = DefaultPopupWindowWidthDefault;

        protected virtual LocationProvider GetLocationProvider()
            => new LocationProvider();

        public IEnumerable<WindowLocation> AllowedLocations
        {
            get
            {
                var provider = this.GetLocationProvider() ?? new LocationProvider();

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