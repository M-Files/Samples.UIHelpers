"use strict";

function Dashboard(d)
{
    /// <summary>The entry point of Dashboard.</summary>
    /// <param name="d" type="MFiles.Dashboard">The new Dashboard object.</param>
    var dashboard = this;

    // Parent is a shell pane container (tab), when dashboard is shown in right pane.
    var shellUI = null;
    switch (d.CustomData.currentLocation)
    {
        case 0: // Bottom pane.
        case 1: // Right-hand pane.
            shellUI = d.Parent.ShellFrame.ShellUI;
            break;
        case 2: // Popup pane.
            shellUI = d.Parent;
            break;
    }

    // Initialize console.
    console.initialize(shellUI, "Show preview (dashboard)");

    // Set up the renderer.
    var renderer = new ObjectRenderer(d);

    // Expose the render method.
    dashboard.render = function (selectedItems)
    {
        // Pass a reference back to our renderer.
        if (d.CustomData.registrationCallback)
            d.CustomData.registrationCallback(dashboard.render);

        // Was there only one item selected (and is it an object version)?
        var isOneObjectSelected = selectedItems.Count == 1 && selectedItems.ObjectVersionsAndProperties.Count == 1;

        // We can render one only.
        if (isOneObjectSelected)
            renderer.render(selectedItems.ObjectVersionsAndProperties[0]);
        else
        {
            $("body").css({ "background-color": "red" });
        }

        // Do we need to resize?
        switch (d.CustomData.currentLocation)
        {
            case 0: // Bottom pane;
                break;
            case 1: // Tab;
                break;
            case 2: // Popup;
                var h = parseInt(d.CustomData.configuration.PopupWindowHeight);
                if (isNaN(h))
                    h = 800;
                var w = parseInt(d.CustomData.configuration.PopupWindowWidth);
                if (isNaN(w))
                    w = 550;
                d.Window.SetDefaultSize(w, h, true);
                break;
        }
    }
}

function OnNewDashboard(dashboard)
{
    (new Dashboard(dashboard)).render(dashboard.CustomData.selectedItems);
}