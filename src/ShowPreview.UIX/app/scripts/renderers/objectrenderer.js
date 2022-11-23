
function ObjectRenderer(dashboard)
{
    var renderer = this;
    renderer.dashboard = dashboard;

    // Add the previewer.
    $(".preview")
        .append($("<object id='previewer' classid='clsid:" + MFiles.CLSID.PreviewerCtrl + "'></object>"));
    var previewerDomElement = $("body #previewer").get(0);

    var originalObject = null;
    var currentPath = null;
    renderer.render = function (selectedItem)
    {
        renderer.originalObject = selectedItem;

        // Sanity.
        if (null == selectedItem)
        {
            // Close it.
            dashboard.CustomData.tabClosedCallback(false);
            return;
        }
        renderer.originalObject = selectedItem.Clone();

        // Set the title.
        $("#title").text(selectedItem.VersionData.Title)

        // Get the files.
        var files = dashboard.Vault.ObjectFileOperations.GetFiles(selectedItem.VersionData.ObjVer);
        if (1 != files.Count)
        {
            return;
        }
        var file = files.Item(1);

        // Get the path.
        var newPath = dashboard.Vault.ObjectFileOperations.GetPathInDefaultView(selectedItem.VersionData.ObjVer.ObjID,
            selectedItem.VersionData.ObjVer.Version,
            file.ID,
            file.Version,
            0,
            false);

        if (currentPath == newPath)
            return;

        // Set the previewer.
        try
        {
            previewerDomElement.ShowFilePreview(newPath);
            currentPath = newPath;
        }
        catch (e)
        {
        }
    }

    // Configure the close button.
    $("#btnClose").click(function ()
    {
        if (typeof (dashboard.CustomData.tabClosedCallback) == "function")
            dashboard.CustomData.tabClosedCallback(true);
        if(null != dashboard.Window)
            dashboard.Window.Close();
    }).text(dashboard.CustomData.configuration.ResourceStrings.Buttons_Close || "Close");

    // Configure the locations buttons
    function isLocationAllowed(location)
    {
        // Don't show an option to select the same place.
        if (dashboard.CustomData.windowManager.getCurrentLocation() == location)
            return false;
        for (var i = 0; i < dashboard.CustomData.configuration.AllowedLocations.length; i++)
        {
            if (dashboard.CustomData.configuration.AllowedLocations[i] == location)
                return true;
        }
        return false;
    }
    $(".button.window.bottom").each(function (i, o)
    {
        var $button = $(this)
            .attr
            (
                "title",
                dashboard.CustomData.configuration.ResourceStrings.Location_ShowBelowListing || "Show below the listing"
            );
        $button.click(function ()
        {
            // Toggle to bottom.
            dashboard.CustomData.windowManager.setCurrentLocation(0);
            if (null != dashboard.Window)
                dashboard.Window.Close();
        });
        if (!isLocationAllowed(0))
            $button.hide();
    });
    $(".button.window.tab").each(function (i, o)
    {
        var $button = $(this)
            .attr
            (
                "title",
                dashboard.CustomData.configuration.ResourceStrings.Location_ShowInTabOnRight || "Show in tab on right"
            );
        $button.click(function ()
        {
            // Toggle to tab.
            dashboard.CustomData.windowManager.setCurrentLocation(1);
            if (null != dashboard.Window)
                dashboard.Window.Close();
        });
        if (!isLocationAllowed(1))
            $button.hide();
    });
    $(".button.window.popout").each(function (i, o)
    {
        var $button = $(this)
            .attr
            (
                "title",
                dashboard.CustomData.configuration.ResourceStrings.Location_ShowInPopOutWindow || "Show in a pop-out window"
            );
        $button.click(function ()
        {
            // Toggle to popout.
            dashboard.CustomData.windowManager.setCurrentLocation(2);
            if (null != dashboard.Window)
                dashboard.Window.Close();
        });
        if (!isLocationAllowed(2))
            $button.hide();
    });

    return renderer;
}