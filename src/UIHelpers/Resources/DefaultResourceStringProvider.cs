using MFiles.VAF.Extensions.ExtensionMethods;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using System.Runtime.Serialization;
using UIHelpers.Modules.Base;

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
        public override ResourceStrings Create(string languageCode, ModuleBase module, Dictionary<string, TranslationBase> translations)
        {
            // Sanity.
            if (string.IsNullOrWhiteSpace(languageCode))
                languageCode = DefaultResourceStringProvider.DefaultLanguageCode;
            if(null == module)
                throw new ArgumentNullException(nameof(module));
            if(null == translations)
                translations = new Dictionary<string, TranslationBase>();

            // Create the instance.
            var resourceStrings = new ResourceStrings();

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
                    var key = v.Key?.ToString();
                    if (key.StartsWith(module.GetType().FullName + "."))
                        key = key.Substring(module.GetType().FullName.Length + 1);
                    resourceStrings.AddOrUpdate(key, v.Value?.ToString());
                }
                catch (Exception e)
                {
                    this.Logger?.Warn(e, $"Could not add UI resource {v} to the dictionary.");
                }
            }

            // If we have a valid language override then use that.
            {
                var translation = (translations?.ContainsKey(languageCode) ?? false)
                    ? translations[languageCode]
                    : null;
                if (null != translation)
                {
                    foreach(var member in translation.GetType().GetMembers())
                    {
                        // Skip those without data members.
                        if (member.GetCustomAttribute<DataMemberAttribute>() == null)
                            continue;

                        // Get data from the member.
                        string value;
                        switch (member.MemberType)
                        {
                            case MemberTypes.Field:
                                {
                                    var f = member as FieldInfo;
                                    if (f.IsStatic)
                                        continue;
                                    if (f.FieldType != typeof(string))
                                        continue;
                                    value = f.GetValue(translation) as string;
                                }
                                break;
                            case MemberTypes.Property:
                                {
                                    var p = member as PropertyInfo;
                                    if (!p.CanRead)
                                        continue;
                                    if (p.PropertyType != typeof(string))
                                        continue;
                                    value = p.GetValue(translation) as string;
                                }
                                break;
                            default:
                                continue;
                        }

                        // Skip empty.
                        if (string.IsNullOrWhiteSpace(value))
                            continue;

                        // Add it to the resources.
                        resourceStrings.AddOrUpdate(member.Name, value);
                    }
                }
            }

            // Return the collection.
            return resourceStrings;
        }
    }
}