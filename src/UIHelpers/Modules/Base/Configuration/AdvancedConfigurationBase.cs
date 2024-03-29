﻿using MFiles.VAF.Configuration;
using MFilesAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using UIHelpers.Locations;
using UIHelpers.Modules.ShowPreview;
using UIHelpers.Modules.ViewAllMetadata;

namespace UIHelpers.Modules.Base
{
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    public abstract class AdvancedConfigurationBase
        : ICanPerformCustomValidation
    {
        /// <summary>
        /// The default for <see cref="DefaultLocation"/>.
        /// </summary>
        public const WindowLocation DefaultLocationDefault = WindowLocation.BottomPane;

        /// <summary>
        /// Gets the location that this module will default to being displayed, unless the user moves it.
        /// </summary>
        public abstract WindowLocation DefaultLocation { get; set; }

        /// <summary>
        /// Gets the locations that this module can be displayed. 
        /// NOTE: TYPICALLY USE <see cref="AllowedLocations"/> INSTEAD.
        /// </summary>
        public abstract Dictionary<string, bool> ConfiguredLocations { get; set; }

        /// <summary>
        /// The default for <see cref="DefaultPopupWindowHeight"/>.
        /// </summary>
        public const int DefaultPopupWindowHeightDefault = 800;

        /// <summary>
        /// The default height of the popup window.
        /// </summary>
        [DataMember]
        [JsonConfIntegerEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.DefaultPopupWindowHeight_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.DefaultPopupWindowHeight_HelpText),
            DefaultValue = DefaultPopupWindowHeightDefault,
            Min = 500,
            Max = 4000
        )]
        public int DefaultPopupWindowHeight { get; set; } = DefaultPopupWindowHeightDefault;

        /// <summary>
        /// The default for <see cref="DefaultPopupWindowHeight"/>.
        /// </summary>
        public const int DefaultPopupWindowWidthDefault = 550;

        /// <summary>
        /// The default width of the popup window.
        /// </summary>
        [DataMember]
        [JsonConfIntegerEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.DefaultPopupWindowWidth_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.DefaultPopupWindowWidth_HelpText),
            DefaultValue = DefaultPopupWindowWidthDefault,
            Min = 400,
            Max = 4000
        )]
        public int DefaultPopupWindowWidth { get; set; } = DefaultPopupWindowWidthDefault;

        /// <summary>
        /// The default for <see cref="CommandLocation"/>.
        /// </summary>
        public const MenuLocation CommandLocationDefault = MenuLocation.MenuLocation_ContextMenu_Top;

        [DataMember(Order = 3)]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.CommandLocation_Label),
            HelpText = ResourceMarker.Id + nameof(Resources.Configuration.CommandLocation_HelpText),
            DefaultValue = CommandLocationDefault
        )]
        public MenuLocation CommandLocation { get; set; } = CommandLocationDefault;

        public abstract int CommandPriority { get; set; }

        /// <summary>
        /// Returns a <see cref="IObjectEditorMembersProvider"/> for locations.
        /// This may be different on different modules due to default values for things like the allowed locations.
        /// </summary>
        /// <returns></returns>
        protected virtual WindowLocationOptionsProvider GetLocationProvider()
            => new WindowLocationOptionsProvider();

        /// <summary>
        /// Gets the locations that this module can be displayed.
        /// </summary>
        /// <remarks>
        /// Note that <see cref="ConfiguredLocations"/> only contains the data that has been explicitly configured.  
        /// This property also takes into account the default values.
        /// </remarks>
        public IEnumerable<WindowLocation> AllowedLocations
        {
            get
            {
                var provider = this.GetLocationProvider() ?? new WindowLocationOptionsProvider();

                return Enum.GetNames(typeof(WindowLocation))
                  .Select(n => new Tuple<string, WindowLocation, bool?>(n, (WindowLocation)Enum.Parse(typeof(WindowLocation), n), null))
                  .Where(n =>
                  {
                      // Is it explicitly configured?
                      if ((this.ConfiguredLocations?.ContainsKey(n.Item1) ?? false))
                          return this.ConfiguredLocations[n.Item1];

                      // Do we have a default?
                      if ((provider.EnabledByDefault?.ContainsKey(n.Item2) ?? false))
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

        /// <summary>
        /// Gets any configured translations.
        /// </summary>
        /// <returns></returns>
        public virtual Dictionary<string, TranslationBase> GetTranslations() => new Dictionary<string, TranslationBase>();

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
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    public abstract class AdvancedConfigurationBase<TTranslationType>
        : AdvancedConfigurationBase
        where TTranslationType : TranslationBase, new()
    {

        /// <summary>
        /// Gets any translations for this module.
        /// </summary>
        public abstract Dictionary<string, TTranslationType> Translations { get; set; }

        /// <inheritdoc />
        public override Dictionary<string, TranslationBase> GetTranslations()
        {
            var dict = new Dictionary<string, TranslationBase>();
            if (null != this.Translations)
                foreach (var kvp in this.Translations)
                    dict.Add(kvp.Key, kvp.Value);
            return dict;
        }
    }
}