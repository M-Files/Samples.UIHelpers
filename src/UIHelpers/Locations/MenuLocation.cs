using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace UIHelpers.Locations
{
    [DataContract]
    public enum MenuLocation
    {
        MenuLocation_ContextMenu_AfterWindowsCommands = 23,
        MenuLocation_ContextMenu_BeforeProperties = 42,
        MenuLocation_ContextMenu_BeforeWindowsCommands = 22,
        MenuLocation_ContextMenu_Bottom = 43,
        MenuLocation_ContextMenu_CollectionMembersSpecific = 35,
        MenuLocation_ContextMenu_DefaultCommand = 20,
        MenuLocation_ContextMenu_Deletion = 36,
        MenuLocation_ContextMenu_DocumentConversions = 41,
        MenuLocation_ContextMenu_Edit = 37,
        MenuLocation_ContextMenu_FileCreation = 25,
        MenuLocation_ContextMenu_FolderSpecific = 27,
        MenuLocation_ContextMenu_HistorySpecific = 33,
        MenuLocation_ContextMenu_Misc1_Bottom = 32,
        MenuLocation_ContextMenu_Misc1_Middle = 31,
        MenuLocation_ContextMenu_Misc1_Top = 30,
        MenuLocation_ContextMenu_Misc2_Bottom = 40,
        MenuLocation_ContextMenu_Misc2_Middle = 39,
        MenuLocation_ContextMenu_Misc2_Top = 38,
        MenuLocation_ContextMenu_ObjectCreation = 24,
        MenuLocation_ContextMenu_ObjectOperations = 26,
        MenuLocation_ContextMenu_PropertyFolder = 44,
        MenuLocation_ContextMenu_RelationshipsSpecific = 34,
        MenuLocation_ContextMenu_SingleFolderSpecific = 28,
        MenuLocation_ContextMenu_Top = 21,
        MenuLocation_ContextMenu_ViewVisibility = 29

    }
}
