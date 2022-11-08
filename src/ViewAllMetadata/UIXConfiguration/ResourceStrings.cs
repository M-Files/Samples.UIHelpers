using MFiles.VaultApplications.Logging;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.Serialization;

namespace SeparatePreview
{
    [DataContract]
    public class ResourceStrings
        : Dictionary<string, string>
    {
        public ResourceStrings()
        {
        }
    }
}