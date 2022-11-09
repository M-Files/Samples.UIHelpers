"use strict";

function Dashboard(dashboard)
{
    /// <summary>The entry point of Dashboard.</summary>
    /// <param name="dashboard" type="MFiles.Dashboard">The new Dashboard object.</param>

    // Parent is a shell pane container (tab), when dashboard is shown in right pane.
    var shellUI = dashboard.Parent.ShellFrame.ShellUI;

    // Initialize console.
    console.initialize(shellUI, "Show all metadata (dashboard)");

    // Set up the renderer.
    var renderer = new Renderer(dashboard);

    // Configure the close button.
    $("#btnClose").click(function ()
    {
        if (typeof (dashboard.CustomData.tabClosedCallback) == "function")
            dashboard.CustomData.tabClosedCallback(true);
    }).text(dashboard.CustomData.resourceStrings.Buttons_Close || "Close");
}

function OnNewDashboard(dashboard)
{
    new Dashboard(dashboard);
}