using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.AdminConfigurations;
using MFiles.VAF.Configuration.JsonEditor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Resources;

namespace ViewAllMetadata
{
    public enum Location
    {
        [JsonConfEditor(Label = ResourceMarker.Id + nameof(Resources.Configuration.Location_BottomPane))]
        BottomPane = 0,

        [JsonConfEditor(Label = ResourceMarker.Id + nameof(Resources.Configuration.Location_NewTab))]
        NewTab = 1,

        [JsonConfEditor(Label = ResourceMarker.Id + nameof(Resources.Configuration.Location_PopOut))]
        PopOut = 2
    }

    public class LocationProvider
        : IObjectEditorMembersProvider, IStableValueOptionsProvider
    {
        public class ViewAllMetadataLocationProvider
            : LocationProvider
        {
            public ViewAllMetadataLocationProvider()
                : base
                (
                    new[] { Location.BottomPane, Location.NewTab, Location.PopOut },
                    new Location[0]
                )
            {

            }
        }
        public Dictionary<Location, bool> EnabledByDefault { get; }
            = new Dictionary<Location, bool>();
        public HashSet<Location> HiddenLocations { get; }
            = new HashSet<Location>();

        public LocationProvider() { }
        public LocationProvider
        (
            IEnumerable<Location> enabledByDefault,
            IEnumerable<Location> hiddenLocations
        )
            : this()
        {
            foreach (var l in enabledByDefault ?? Enumerable.Empty<Location>())
            {
                this.EnabledByDefault.Add(l, true);
            }
            foreach (var l in hiddenLocations ?? Enumerable.Empty<Location>())
            {
                this.HiddenLocations.Add(l);
            }
        }

        public IEnumerable<ObjectEditorMember> GetMembers
        (
            Type memberType,
            IConfigurationRequestContext context,
            ResourceManager resourceManager
        )
        {
            var members = new SortedList<string, ObjectEditorMember>();
            foreach (Location v in Enum.GetValues(typeof(Location)))
            {
                // Skip hidden ones.
                if (this.HiddenLocations.Contains(v))
                    continue;

                var label = v.ToString();
                try
                {
                    var jsonConfAttribute = typeof(Location)
                        .GetMember(label)?
                        .FirstOrDefault()?
                        .GetCustomAttribute<JsonConfEditorAttribute>();
                    if (null != jsonConfAttribute)
                        label = jsonConfAttribute.Label;
                }
                finally
                {
                    label = ResourceMarker.ResolveText(label, "", resourceManager); ;
                    if (string.IsNullOrWhiteSpace(label))
                        label = v.ToString();
                }
                members.Add(label, new ObjectEditorMember()
                {
                    Key = v.ToString(),
                    Attributes = new List<Attribute>()
                    {
                        new JsonConfEditorAttribute()
                        {
                            Label = label,
                            DefaultValue = this.EnabledByDefault.ContainsKey(v)
                                ? this.EnabledByDefault[v]
                                : (memberType.IsValueType)
                                    ? Activator.CreateInstance(memberType)
                                    : null
                        }
                    }
                });
            }
            return members.Values;
        }

        public IEnumerable<ValueOption> GetOptions(IConfigurationRequestContext context)
        {
            foreach (var m in this.GetMembers(typeof(Location), context, null))
            {
                var jsonConfEditorAttribute = m.Attributes.Where(a => a is JsonConfEditorAttribute).FirstOrDefault() as JsonConfEditorAttribute;
                var l = (Location)Enum.Parse(typeof(Location), m.Key);
                yield return new ValueOption()
                {
                    Value = l,
                    Label = this.ConvertFromResourceString(jsonConfEditorAttribute?.Label) ?? m.Key,
                    HelpText = this.ConvertFromResourceString(jsonConfEditorAttribute?.HelpText),
                    Hidden = this.HiddenLocations.Contains(l)
                };
            }
        }

        protected virtual string ConvertFromResourceString(string input)
        {
            // Sanity.
            if(!(input?.StartsWith(ResourceMarker.Id) ?? false))
                return input;

            return Resources.Configuration.ResourceManager.GetString(input.Substring(ResourceMarker.Id.Length));
        }
    }
}