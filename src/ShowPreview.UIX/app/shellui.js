"use strict";
// Entry point of the shell ui application.
function OnNewShellUI(shellUI) {

    // Initialize the console.
    console.initialize(shellUI, "myAppName");

    // Wait for shell frames to be created.
    shellUI.Events.Register(MFiles.Event.NewNormalShellFrame, OnNewNormalShellFrame);
}

// Handler for shell frame created event.
function OnNewNormalShellFrame(shellFrame) {

    // Add tab to right pane, when the shell frame is started.
    var myTab;
    shellFrame.Events.Register(MFiles.Event.Started, OnStarted);
    function OnStarted() {
        myTab = shellFrame.RightPane.AddTab("my-tab", "My Dashboard", "_last");
    }

    // React to when the selection changes in the ui.
    shellFrame.Events.Register(MFiles.Event.NewShellListing, OnNewShellListing);
    function OnNewShellListing(shellListing) {
        shellListing.Events.Register(MFiles.Event.SelectionChanged, OnSelectionChanged);
    }

    // Show dashboard, if exactly one document is selected.
    function OnSelectionChanged(selectedItems) {

        // Show, if exactly one document is selected, otherwise hide.
        if (IsExactlyOneDocumentSelected(selectedItems))
            ShowDashboard(selectedItems.ObjectVersions[0]);
        else
            HideDashboard();
    }

    // Returns true, if exactly one document is selected.
    function IsExactlyOneDocumentSelected(selectedItems) {

        // Ensure that we have exactly one item selected and that it is an object.
        if (selectedItems.Count != 1 || selectedItems.ObjectVersions.Count != 1)
            return false;

        // Get the selected object.
        var selectedItem = selectedItems.ObjectVersions[0];

        // Ensure that we have a document.
        if (selectedItem.ObjVer.Type != 0)
            return false;

        // Exactly one document is selected.
        return true;
    }

    // Shows dashboard in the tab and sets the tab visible.
    function ShowDashboard(objectVersion) {

        // Show dashboard content in right pane tab. Ensure that the tab is visible.
        myTab.ShowDashboard("my-dashboard", { ObjectVersion: objectVersion });
        myTab.Visible = true;
    }

    // Hides the dashboard by hiding the tab.
    function HideDashboard() {

        // Ensure that the tab is not visible.
        myTab.Visible = false;
    }
}
