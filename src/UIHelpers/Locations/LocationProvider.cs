using MFiles.VAF.Configuration;
using MFiles.VAF.Configuration.AdminConfigurations;
using MFiles.VAF.Configuration.JsonEditor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Resources;

namespace UIHelpers
{
    public class LocationProvider
        : IObjectEditorMembersProvider, IStableValueOptionsProvider
    {
        public class ShowPreviewLocationProvider
            : LocationProvider
        {
            public ShowPreviewLocationProvider()
                : base
                (
                    new[] { WindowLocation.BottomPane, WindowLocation.PopOut },
                    new WindowLocation[0]
                )
            {

            }
        }
        public class ViewAllMetadataLocationProvider
            : LocationProvider
        {
            public ViewAllMetadataLocationProvider()
                : base
                (
                    new[] { WindowLocation.BottomPane, WindowLocation.NewTab, WindowLocation.PopOut },
                    new WindowLocation[0]
                )
            {

            }
        }
        public Dictionary<WindowLocation, bool> EnabledByDefault { get; }
            = new Dictionary<WindowLocation, bool>();
        public HashSet<WindowLocation> HiddenLocations { get; }
            = new HashSet<WindowLocation>();

        public LocationProvider() { }
        public LocationProvider
        (
            IEnumerable<WindowLocation> enabledByDefault,
            IEnumerable<WindowLocation> hiddenLocations
        )
            : this()
        {
            foreach (var l in enabledByDefault ?? Enumerable.Empty<WindowLocation>())
            {
                this.EnabledByDefault.Add(l, true);
            }
            foreach (var l in hiddenLocations ?? Enumerable.Empty<WindowLocation>())
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
            foreach (WindowLocation v in Enum.GetValues(typeof(WindowLocation)))
            {
                // Skip hidden ones.
                if (this.HiddenLocations.Contains(v))
                    continue;

                var label = v.ToString();
                try
                {
                    var jsonConfAttribute = typeof(WindowLocation)
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
            foreach (var m in this.GetMembers(typeof(WindowLocation), context, null))
            {
                var jsonConfEditorAttribute = m.Attributes.Where(a => a is JsonConfEditorAttribute).FirstOrDefault() as JsonConfEditorAttribute;
                var l = (WindowLocation)Enum.Parse(typeof(WindowLocation), m.Key);
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