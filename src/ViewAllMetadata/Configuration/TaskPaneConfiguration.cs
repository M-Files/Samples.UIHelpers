using MFiles.VAF.Configuration;
using System.Runtime.Serialization;

namespace SeparatePreview
{
    [DataContract]
    public class TaskPaneConfiguration
    {
        [DataMember]
        [JsonConfEditor(Label = "Task Pane Group", DefaultValue = TaskPaneGroup.ViewAndModify)]
        public TaskPaneGroup TaskPaneGroup { get; set; } 
            = TaskPaneGroup.ViewAndModify;

        [DataMember]
        [JsonConfEditor
        (
            Label = "Custom Task Pane Group Name",
            Hidden = true,
            ShowWhen = ".parent._children{.key == 'TaskPaneGroup' && .value == 'Custom' }"
        )]
        public string CustomTaskPaneGroupName { get; set; }

        [DataMember]
        [JsonConfEditor(Label = "Command Priority")]
        public int Priority { get; set; }
    }
}