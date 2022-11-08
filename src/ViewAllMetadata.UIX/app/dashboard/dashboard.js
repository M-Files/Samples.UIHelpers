"use strict";

var dashboard = null;

function handleNewSelectedItem(selectedItem)
{
    // Sanity.
    if (null == selectedItem)
    {
        // TODO: Set to empty.
        return;
    }

    $("#title").text(selectedItem.VersionData.Title)
}

function OnNewDashboard(dashboard)
{
    /// <summary>The entry point of Dashboard.</summary>
    /// <param name="dashboard" type="MFiles.Dashboard">The new Dashboard object.</param>

    // Parent is a shell pane container (tab), when dashboard is shown in right pane.
    var shellUI = dashboard.Parent.ShellFrame.ShellUI;

    // Initialize console.
    console.initialize(shellUI, "Show all metadata (dashboard)");

    // Configure the close button.
    $("#btnClose").click(function ()
    {
        if (typeof (dashboard.CustomData.tabClosedCallback) == "function")
            dashboard.CustomData.tabClosedCallback();
    })

    // Pass a reference back to our handler.
    dashboard.CustomData.registrationCallback(handleNewSelectedItem);

    // Handle any selected item.
    handleNewSelectedItem(dashboard.CustomData.selectedItem)

}