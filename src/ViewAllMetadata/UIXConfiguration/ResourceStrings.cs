using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.Serialization;

namespace ViewAllMetadata
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