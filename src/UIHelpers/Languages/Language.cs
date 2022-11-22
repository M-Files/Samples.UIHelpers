namespace UIHelpers
{
    public class Language
    {
        /// <summary>
        /// The (display) name of this language (e.g. "English").
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The UI code for this language (e.g. "eng").
        /// </summary>
        public string UICode { get; set; }

        /// <summary>
        /// The equivalent .NET culture code for this language (e.g. "en-US").
        /// </summary>
        public string CultureCode { get; set; }

        /// <summary>
        /// Creates a language with the supplied <paramref name="name"/>, <paramref name="uiCode" />, and <paramref name="cultureCode"/>.
        /// </summary>
        /// <param name="name"><see cref="Name"/></param>
        /// <param name="uiCode"><see cref="UICode"/></param>
        /// <param name="cultureCode"><see cref="CultureCode"/></param>
        /// <returns></returns>
        public static Language Create(string name, string uiCode, string cultureCode)
        {
            return new Language()
            {
                Name = name,
                UICode = uiCode,
                CultureCode = cultureCode
            };
        }
    }
}