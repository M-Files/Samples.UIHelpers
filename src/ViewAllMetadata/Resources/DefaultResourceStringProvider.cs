using System;
using System.Collections;
using System.Globalization;
using System.Linq;

namespace ViewAllMetadata
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
        public override ResourceStrings Create(string languageCode, params LanguageOverride[] languageOverrides)
        {
            // Sanity.
            if (string.IsNullOrWhiteSpace(languageCode))
                languageCode = DefaultResourceStringProvider.DefaultLanguageCode;

            // Create the instance.
            var resourceStrings = new ResourceStrings();

            // If we have a valid language override then use that.
            {
                var languageOverride = languageOverrides?.FirstOrDefault(o => o.Language == languageCode);
                if (null != languageOverride)
                {
                    // We have to hard-code some of these values here, unlike in the resources.
                    if(false == string.IsNullOrWhiteSpace(languageOverride.Commands_ShowAllMetadata))
                        resourceStrings.Add(nameof(languageOverride.Commands_ShowAllMetadata), languageOverride.Commands_ShowAllMetadata);
                    if (false == string.IsNullOrWhiteSpace(languageOverride.Buttons_Close))
                        resourceStrings.Add(nameof(languageOverride.Buttons_Close), languageOverride.Buttons_Close);
                    if (false == string.IsNullOrWhiteSpace(languageOverride.Buttons_Discard))
                        resourceStrings.Add(nameof(languageOverride.Buttons_Discard), languageOverride.Buttons_Discard);
                    if (false == string.IsNullOrWhiteSpace(languageOverride.Buttons_Save))
                        resourceStrings.Add(nameof(languageOverride.Buttons_Save), languageOverride.Buttons_Save);
                    return resourceStrings;
                }
            }

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
                    resourceStrings.Add(v.Key?.ToString(), v.Value?.ToString());
                }
                catch (Exception e)
                {
                    this.Logger?.Warn(e, $"Could not add UI resource {v} to the dictionary.");
                }
            }

            // Return the collection.
            return resourceStrings;
        }
    }
}