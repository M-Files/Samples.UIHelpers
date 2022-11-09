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
    new ObjectRenderer(dashboard);
}

function OnNewDashboard(dashboard)
{
    new Dashboard(dashboard);
}