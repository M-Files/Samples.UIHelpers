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
        /// <inheritdoc />
        public IEnumerable<ValidationFinding> CustomValidation(Vault vault)
        {
            return Enumerable.Empty<ValidationFinding>();
        }
    }
}