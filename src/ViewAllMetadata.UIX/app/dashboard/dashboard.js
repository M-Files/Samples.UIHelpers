"use strict";

function Dashboard(d)
{
    /// <summary>The entry point of Dashboard.</summary>
    /// <param name="d" type="MFiles.Dashboard">The new Dashboard object.</param>
    var dashboard = this;

    // Parent is a shell pane container (tab), when dashboard is shown in right pane.
    var shellUI = d.Parent.ShellFrame.ShellUI;

    // Initialize console.
    console.initialize(shellUI, "Show all metadata (dashboard)");

    // Set up the renderer.
    var renderer = new ObjectRenderer(d);

    // Expose the render method.
    dashboard.render = function (selectedItem)
    {
        renderer.render(selectedItem);
    }
}

function OnNewDashboard(dashboard)
{
    (new Dashboard(dashboard)).render(dashboard.CustomData.selectedItem);
}