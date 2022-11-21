using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.AdminConfigurations;
using MFiles.VAF.Configuration.JsonEditor;
using System;
using System.Collections.Generic;
using System.Resources;

namespace ViewAllMetadata
{
    public class LanguageProvider
        : IObjectEditorMembersProvider
    {
        public static readonly List<Language> Languages = new List<Language>();
        static LanguageProvider()
        {

            #region Add standard languages

            Languages.Clear();
            Languages.Add(Language.Create("English (US)", "eng", "en-US"));
            Languages.Add(Language.Create("Finnish", "fin", "fi-FI"));
            Languages.Add(Language.Create("French", "fra", "fr-FR"));
            Languages.Add(Language.Create("Chinese (Taiwan)", "cht", "zh-TW"));
            Languages.Add(Language.Create("German", "deu", "de-DE"));
            Languages.Add(Language.Create("Polish", "plk", "pl-PL"));
            Languages.Add(Language.Create("Slovenian", "slv", "sl-SI"));
            Languages.Add(Language.Create("Vietnamese", "vit", "vi-VN"));
            Languages.Add(Language.Create("Portuguese (Brazil)", "ptb", "pt-BR"));
            Languages.Add(Language.Create("Hungarian", "hun", "hu-HU"));
            Languages.Add(Language.Create("Swedish", "sve", "sv-SE"));
            Languages.Add(Language.Create("Dutch", "nld", "nl-NL"));
            Languages.Add(Language.Create("Turkish", "trk", "tr-TR"));
            Languages.Add(Language.Create("Greek", "ell", "el-GR"));
            Languages.Add(Language.Create("Japanese", "jpn", "ja-JP"));
            Languages.Add(Language.Create("Arabic", "ara", "ar-JO"));
            Languages.Add(Language.Create("Italian", "ita", "it-IT"));
            Languages.Add(Language.Create("Spanish", "esn", "es-ES"));
            Languages.Add(Language.Create("Russian", "rus", "ru-RU"));
            Languages.Add(Language.Create("Croatian", "hrv", "hr-HR"));
            Languages.Add(Language.Create("Chinese (PRC)", "chs", "zh-CN"));
            Languages.Add(Language.Create("Czech", "csy", "cs-CZ"));
            Languages.Add(Language.Create("Bulgarian", "bgr", "bg-BG"));
            Languages.Add(Language.Create("Hebrew", "heb", "he-IL"));
            Languages.Add(Language.Create("Romanian", "rom", "ro-RO"));
            Languages.Add(Language.Create("Estonian", "eti", "et-EE"));
            Languages.Add(Language.Create("Danish", "dan", "da-DK"));
            Languages.Add(Language.Create("Norwegian", "nor", "nb-NO"));
            Languages.Add(Language.Create("Albanian", "sqi", "sq-AL"));
            Languages.Add(Language.Create("Slovak", "sky", "sk-SK"));
            Languages.Add(Language.Create("Korean", "kor", "ko-KR"));
            Languages.Add(Language.Create("Serbian (Latin)", "srm", "sr-Latn-BA"));
            Languages.Add(Language.Create("Serbian (Cyrillic)", "sro", "sr-Cyrl-RS"));
            Languages.Add(Language.Create("Thai", "tha", "th-TH"));
            Languages.Add(Language.Create("Macedonian", "mki", "mk-MK"));
            Languages.Add(Language.Create("Ukrainian", "ukr", "uk-UA"));
            Languages.Add(Language.Create("Mongolian", "mon", "mn-MN"));

            #endregion

        }

        public IEnumerable<ObjectEditorMember> GetMembers
        (
            Type memberType,
            IConfigurationRequestContext context,
            ResourceManager resourceManager
        )
        {
            var members = new SortedList<string, ObjectEditorMember>();
            foreach (var l in Languages)
            {
                var label = ResourceMarker.ResolveText(l.Name, "", resourceManager);
                if (string.IsNullOrWhiteSpace(label))
                    label = l.Name;
                members.Add(label, new ObjectEditorMember()
                {
                    Key = l.UICode,
                    Attributes = new List<Attribute>()
                    {
                        new JsonConfEditorAttribute()
                        {
                            Label = label,
                            DefaultValue = "Fallback to English (US)"
                        }
                    }
                });
            }
            return members.Values;
        }
    }
}