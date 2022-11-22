using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.Serialization;

namespace UIHelpers
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