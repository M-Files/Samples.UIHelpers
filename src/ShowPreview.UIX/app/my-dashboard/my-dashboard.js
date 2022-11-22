// Entry point of the dashboard.
function OnNewDashboard(dashboard) {

    // Parent is a shell pane container (tab), when dashboard is shown in right pane.
    var tab = dashboard.Parent;

    // Initialize console.
    console.initialize(tab.ShellFrame.ShellUI, "myDashboardName");

    // Some things are ready only after the dashboard has started.
    dashboard.Events.Register(MFiles.Event.Started, OnStarted);
    function OnStarted() {

        // Get the object version from the custom data passed from shell ui part.
        var objectVersion = dashboard.CustomData.ObjectVersion;

        // Show some information of the document.
        AppendBodyWithParagraph("Document Title: " + objectVersion.Title);
        AppendBodyWithParagraph("Document Internal Id: " + objectVersion.ObjVer.ID);
        AppendBodyWithParagraph("Document Guid: " + objectVersion.ObjectGUID);
        AppendBodyWithParagraph("Document Version: " + objectVersion.ObjVer.Version);
        AppendBodyWithParagraph("Document Version Guid: " + objectVersion.VersionGUID);
    }
}

// Helper to show simple text paragraphs in the dashboard.
function AppendBodyWithParagraph(text) {
    var paragraph = document.createElement("p");
    paragraph.innerText = text;
    document.body.appendChild(paragraph);
}
