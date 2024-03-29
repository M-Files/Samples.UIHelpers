﻿using MFiles.VAF.Configuration.Logging;
using System.Collections.Generic;
using System.Linq;
using UIHelpers.Modules.Base;

namespace UIHelpers
{
    /// <summary>
    /// A base implementation of <see cref="IResourceStringProvider"/>
    /// containing various helpers.
    /// </summary>
    public abstract class ResourceStringProviderBase
        : IResourceStringProvider
    {
        /// <summary>
        /// The logger to use for this provider.
        /// </summary>
        protected ILogger Logger { get; }

        /// <summary>
        /// The default language to fall backto, if none is specified.
        /// </summary>
        public const string DefaultLanguageCode = "en-US";

        public ResourceStringProviderBase()
        {
            this.Logger = LogManager.GetLogger(this.GetType());
        }

        /// <summary>
        /// Converts an M-Files UI language string (e.g. "eng") to a language code .NET can use.
        /// </summary>
        /// <param name="uiLanguage">The language string to convert.</param>
        /// <returns>
		/// The appropriate language string, or <see cref="ResourceStringProviderBase.DefaultLanguageCode"/>
		/// if <paramref name="uiLanguage"/> is not supported.
		/// </returns>
		/// <remarks>
		/// If provided with a .NET language code that maps to a valid M-Files UI language string, then
		/// the value is parrotted back.
		/// </remarks>
        protected virtual string ConvertUILanguageToLanguageCode(string uiLanguage)
        {
            // Convert it if needed.
            uiLanguage = LanguageProvider.Languages?.Any(l => l.CultureCode == uiLanguage) ?? false
                ? uiLanguage // We already had a valid culture code.
                : LanguageProvider.Languages?.FirstOrDefault(l => l.UICode == uiLanguage)?.CultureCode;

            return string.IsNullOrWhiteSpace(uiLanguage)

                // No value.  Use the default.
                ? ResourceStringProviderBase.DefaultLanguageCode

                // Use the converted lanugage.
                : uiLanguage;
        }

		/// <inheritdoc />
        public abstract ResourceStrings Create(string language, ModuleBase module, Dictionary<string, TranslationBase> translations);
    }
}