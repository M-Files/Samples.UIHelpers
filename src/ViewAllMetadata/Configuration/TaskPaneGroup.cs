using System.Runtime.Serialization;

namespace SeparatePreview
{
    [DataContract]
    public enum TaskPaneGroup
    {
        Custom = 0,
        New = 1,
        ViewAndModify = 2,
        GoTo = 3,
        Main = 4
    }
}