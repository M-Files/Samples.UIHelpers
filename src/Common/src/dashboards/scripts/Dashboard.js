﻿"use strict";

function Dashboard()
{
    /// <summary>The entry point of Dashboard.</summary>
    /// <param name="d" type="MFiles.Dashboard">The new Dashboard object.</param>
    var t = this;

    var events = new Events();
    t.addEventListener = events.addEventListener;
    t.dispatchEvent = events.dispatchEvent;

    var uixDashboard = null;
    t.getUIXDashboard = function () { return uixDashboard; }

    t.addEventListener(Dashboard.EventTypes.NewDashboard, function (dashboard)
    {
        uixDashboard = dashboard;

        // Parent is a shell pane container (tab), when dashboard is shown in right pane.
        var shellUI = null;
        switch (dashboard.CustomData.currentLocation)
        {
            case 0: // Bottom pane.
            case 1: // Right-hand pane.
                shellUI = dashboard.Parent.ShellFrame.ShellUI;
                break;
            case 2: // Popup pane.
                shellUI = dashboard.Parent;
                break;
        }

        // Initialize console.
        console.initialize(shellUI, dashboard.CustomData.moduleName || "Unknown module");

        // Pass a reference back to our renderer.
        if (dashboard.CustomData.registrationCallback)
            dashboard.CustomData.registrationCallback(function (selectedItems)
            {
                t.dispatchEvent(Dashboard.EventTypes.SelectionChanged, selectedItems)
            });

        // Do we need to resize?
        dashboard.CustomData.windowManager.resizePopupWindow(dashboard.Window);

        // On resize, save the location.
        // Resize fires continuously, so no point reporting back until they are done.
        // This waits until no changes in 0.5s then saves back.
        if (null != dashboard.Window)
        {
            var resizeTimeout = null;
            window.addEventListener("resize", function ()
            {
                if (null != resizeTimeout)
                    this.clearTimeout(resizeTimeout);
                resizeTimeout = this.setTimeout(function ()
                {
                    dashboard.CustomData.windowManager.saveDefaultWindowSize(dashboard.Window.Width, dashboard.Window.Height);
                }, 500);
            });
        }

        // If we have some items then dispatch the event now.
        if (dashboard.CustomData.selectedItems)
            t.dispatchEvent(Dashboard.EventTypes.SelectionChanged, dashboard.CustomData.selectedItems);

    });

    // When the OnNewDashboard method is called, start our dashboard.
    window.OnNewDashboard = function (d) { t.dispatchEvent(Dashboard.EventTypes.NewDashboard, d) };

    return t;
}
Dashboard.EventTypes = {
    NewDashboard: 1,
    SelectionChanged: 2
};