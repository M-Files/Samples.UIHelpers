﻿using System.Collections.Generic;
using UIHelpers.ViewAllMetadata;

namespace UIHelpers
{
    public interface IResourceStringProvider
    {
        /// <summary>
        /// Creates an instance of <see cref="ResourceStrings"/>
        /// based on the input language of <paramref name="languageCode"/>.
        /// </summary>
        /// <param name="languageCode">The language code</param>
        /// <param name="languageOverrides">If provided, strings that override the internal resource dictionary.</param>
        ResourceStrings Create(string languageCode, Dictionary<string, LanguageOverride> languageOverrides);
    }
}