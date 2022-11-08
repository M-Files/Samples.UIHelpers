using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.JsonAdaptor;
using MFiles.VAF.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ViewAllMetadata
{
    [DataContract]
    public class Configuration
        : ConfigurationBase
    {
        [DataMember]
        [JsonConfEditor
        (
            Label = "Languages",
            ChildName = "Language"
        )]

        // TODO: In future versions of the VAF we can use ObjectMembersAttribute!
        public List<LanguageOverride> LanguageOverrides { get; set; } = new List<LanguageOverride>();
    }
}