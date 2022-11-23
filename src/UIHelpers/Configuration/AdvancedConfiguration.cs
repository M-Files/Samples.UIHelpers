using MFiles.VAF.Configuration;
using MFilesAPI;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace UIHelpers
{
    [DataContract]
    [UsesResources(typeof(Resources.Configuration))]
    public class AdvancedConfiguration
        : ICanPerformCustomValidation
    {
        [DataMember]
        [JsonConfEditor
        (
            Label = ResourceMarker.Id + nameof(Resources.Configuration.Languages_Label),
            ChildName = ResourceMarker.Id + nameof(Resources.Configuration.Languages_ChildName)
        )]
        [ObjectMembers(typeof(LanguageProvider))]
        public Dictionary<string, LanguageOverride> LanguageOverrides { get; set; }
            = new Dictionary<string, LanguageOverride>();

        /// <inheritdoc />
        public IEnumerable<ValidationFinding> CustomValidation(Vault vault)
        {
            return Enumerable.Empty<ValidationFinding>();
        }
    }
}