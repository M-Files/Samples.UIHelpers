using MFiles.VAF.Configuration;
using MFilesAPI;
using System.Collections.Generic;

namespace UIHelpers.ViewAllMetadata
{
    /// <summary>
    /// This instance can validate itself.
    /// </summary>
    public interface ICanPerformCustomValidation
    {
        /// <summary>
        /// Returns validation findings.
        /// </summary>
        /// <param name="vault">The vault; may be null.</param>
        /// <returns>Any validation findings.</returns>
        IEnumerable<ValidationFinding> CustomValidation(Vault vault);
    }
}