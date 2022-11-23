using MFiles.VAF.Extensions.ExtensionMethods;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using UIHelpers.ViewAllMetadata;

namespace UIHelpers
{
    /// <summary>
    /// The default implementation of <see cref="IResourceStringProvider"/>,
    /// retrieving data from the embedded resources.
    /// </summary>
    internal class DefaultResourceStringProvider
        : ResourceStringProviderBase
    {
        /// <inheritdoc />
        /// <exception cref="ArgumentNullException"></exception>
        public override ResourceStrings Create(string languageCode, Dictionary<string, LanguageOverride> languageOverrides)
        {
            // Sanity.
            if (string.IsNullOrWhiteSpace(languageCode))
                languageCode = DefaultResourceStringProvider.DefaultLanguageCode;

            // Create the instance.
            var resourceStrings = new ResourceStrings();

            // Add the tab IDs.
            resourceStrings.Add("TabIDs_RawMetadata", "rawMetadata");
            resourceStrings.Add("TabIDs_ShowPreview", "showPreview");

            // Ensure that we have a valid value.
            var cultureCode = this.ConvertUILanguageToLanguageCode(languageCode);

            // Attempt to get the culture for the language code provided, or fall back to the UI culture.
            var cultureInfo = CultureInfo.CurrentUICulture;
            try
            {
                cultureInfo = CultureInfo.CreateSpecificCulture(cultureCode);
            }
            catch (Exception e)
            {
                this.Logger?.Warn(e, $"Could not create specific culture for language code {cultureCode}.");
            }

            // Read the resources from the resource manager into the dictionary.
            foreach (DictionaryEntry v in Resources.UIResources.ResourceManager.GetResourceSet(cultureInfo, true, true))
            {
                try
                {
                    resourceStrings.AddOrUpdate(v.Key?.ToString(), v.Value?.ToString());
                }
                catch (Exception e)
                {
                    this.Logger?.Warn(e, $"Could not add UI resource {v} to the dictionary.");
                }
            }

            // If we have a valid language override then use that.
            {
                var languageOverride = (languageOverrides?.ContainsKey(languageCode) ?? false)
                    ? languageOverrides[languageCode]
                    : null;
                if (null != languageOverride)
                {
                    // We have to hard-code some of these values here, unlike in the resources.
                    if(false == string.IsNullOrWhiteSpace(languageOverride.Commands_ShowAllMetadata))
                        resourceStrings.AddOrUpdate(nameof(languageOverride.Commands_ShowAllMetadata), languageOverride.Commands_ShowAllMetadata);
                    if (false == string.IsNullOrWhiteSpace(languageOverride.Buttons_Close))
                        resourceStrings.AddOrUpdate(nameof(languageOverride.Buttons_Close), languageOverride.Buttons_Close);
                    if (false == string.IsNullOrWhiteSpace(languageOverride.Buttons_Discard))
                        resourceStrings.AddOrUpdate(nameof(languageOverride.Buttons_Discard), languageOverride.Buttons_Discard);
                    if (false == string.IsNullOrWhiteSpace(languageOverride.Buttons_Save))
                        resourceStrings.AddOrUpdate(nameof(languageOverride.Buttons_Save), languageOverride.Buttons_Save);
                    if (false == string.IsNullOrWhiteSpace(languageOverride.Location_ShowBelowListing))
                        resourceStrings.AddOrUpdate(nameof(languageOverride.Location_ShowBelowListing), languageOverride.Location_ShowBelowListing);
                    if (false == string.IsNullOrWhiteSpace(languageOverride.Location_ShowInTabOnRight))
                        resourceStrings.AddOrUpdate(nameof(languageOverride.Location_ShowInTabOnRight), languageOverride.Location_ShowInTabOnRight);
                    if (false == string.IsNullOrWhiteSpace(languageOverride.Location_ShowInPopOutWindow))
                        resourceStrings.AddOrUpdate(nameof(languageOverride.Location_ShowInPopOutWindow), languageOverride.Location_ShowInPopOutWindow);
                    if (false == string.IsNullOrWhiteSpace(languageOverride.TabTitles_RawMetadata))
                        resourceStrings.AddOrUpdate(nameof(languageOverride.TabTitles_RawMetadata), languageOverride.TabTitles_RawMetadata);
                    if (false == string.IsNullOrWhiteSpace(languageOverride.TabTitles_ShowPreview))
                        resourceStrings.AddOrUpdate(nameof(languageOverride.TabTitles_ShowPreview), languageOverride.TabTitles_ShowPreview);
                }
            }

            // Return the collection.
            return resourceStrings;
        }
    }
}