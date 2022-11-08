"use strict";

var g_dashboard = null;
var g_previewer = null;
var g_currentPath = null;

function setToEmpty()
{
    // Mark the body as empty.
    $("body").addClass("empty");

    // If we have a previewer, empty it.
    if (null != g_previewer)
    {
        try
        {
            // g_previewer.ClearPreview();
        }
        catch (e) { }
    }
}

function hasChanged(path)
{
    return g_currentPath != path;
}

function handleNewSelectedItems(selectedItems)
{
    // Handle nothing shown.
    if (null == selectedItems
        || null == selectedItems.ObjectVersions
        || selectedItems.ObjectVersions.Count != 1)
    {
        g_currentPath = null;
        return setToEmpty();
    }

    // Handle a single item selected.
    var objectVersion = selectedItems.ObjectVersions.Item(1);

    // Get the files.
    var files = g_dashboard.Vault.ObjectFileOperations.GetFiles(objectVersion.ObjVer);
    if (1 != files.Count)
    {
        g_currentPath = null;
        return setToEmpty();
    }
    var file = files.Item(1);

    // Get the path.
    var path = g_dashboard.Vault.ObjectFileOperations.GetPathInDefaultView(objectVersion.ObjVer.ObjID,
        objectVersion.ObjVer.Version,
        file.ID,
        file.Version,
        0,
        false);

    // Has it changed?
    if (false == hasChanged(path))
    {
        return;
    }

    // Set the previewer.
    try
    {
        g_previewer.ShowFilePreview(path);
        g_currentPath = path;
    }
    catch (e)
    {
    }

    // Isn't empty any more.
    $("body").removeClass("empty");

}

function OnNewDashboard(dashboard)
{
    /// <summary>The entry point of Dashboard.</summary>
    /// <param name="dashboard" type="MFiles.Dashboard">The new Dashboard object.</param>

    // Parent is a shell pane container (tab), when dashboard is shown in right pane.
    var shellUI = dashboard.Parent;

    // Initialize console.
    console.initialize(shellUI, "Preview Dashboard");

    g_dashboard = dashboard;

    // Get a reference to the body element using jQuery.
    var $body = $("body");

    // Create our previewer.
    var $previewer = $("<object id='previewer' classid='clsid:" + MFiles.CLSID.PreviewerCtrl + "'></object>");

    // Add the previewer.
    $body.append($previewer);

    // Get a reference to the HTML element.
    g_previewer = $("body #previewer").get(0);

    // Pass a reference back to our handler.
    g_dashboard.CustomData.registrationCallback(handleNewSelectedItems);

    // When the window is stopped (closed), call back to the container.
    g_dashboard.Events.Register(
        Event_Stop,
        function ()
        {
            try
            {
                g_dashboard.CustomData.windowClosed();
            }
            catch (e)
            {
                // This excepts if we are closing the M-Files window
                // and the reference to the dashboard or shell frame is now dead.
            }
        }
    );

    // If we have configuration then use it.
    if (g_dashboard.CustomData.configuration)
    {
        document.title = g_dashboard.CustomData.configuration.ResourceStrings.PreviewWindow_Title;
        $("#selectDocument").text(g_dashboard.CustomData.configuration.ResourceStrings.PreviewWindow_PleaseSelectADocument);
    }

    // Set to empty.
    return setToEmpty("Initial");

}