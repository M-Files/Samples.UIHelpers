
function ObjectRenderer(dashboard)
{
    var renderer = this;
    renderer.dashboard = dashboard;
    var propertyValueRenderers = [];
    function getOrderedProperties(objectClass, objectProperties)
    {
        var renderedPropertyDefs = [];
        var properties = [];

        // Class is always first.
        properties.push({ propertyDef: 100, isRequired: true, isRemovable: false });
        renderedPropertyDefs.push(100);

        // Then properties from the class, in the order they
        // appear in the associated property defs collection.
        for (var i = 0; i < objectClass.AssociatedPropertyDefs.Count; i++)
        {
            var associatedPropertyDef = objectClass.AssociatedPropertyDefs[i];

            // Skip built-in properties.
            if (associatedPropertyDef.PropertyDef < 1000 && associatedPropertyDef.PropertyDef != 0 && associatedPropertyDef.PropertyDef != 100)
                continue;

            // Add in the property.
            properties.push({ propertyDef: associatedPropertyDef.PropertyDef, isRequired: associatedPropertyDef.Required, isRemovable: false });
            renderedPropertyDefs.push(associatedPropertyDef.PropertyDef);
        }

        // Then anything else.
        for (var i = 0; i < objectProperties.Count; i++)
        {
            var p = objectProperties[i];

            // Skip rendered ones.
            if (renderedPropertyDefs.indexOf(p.PropertyDef) > -1)
                continue;

            // Skip built-in properties.
            if (p.PropertyDef < 1000 && p.PropertyDef != 0 && p.PropertyDef != 100)
                continue;

            // If this is the name or title and we have another property set for that on the class then skip.
            if (p.propertyDef == 0 && objectClass.NamePropertyDef > 0)
                continue;

            // Add in the property.
            properties.push({ propertyDef: p.PropertyDef, isRequired: false, isRemovable: true });
            renderedPropertyDefs.push(p.PropertyDef);
        }

        // Return the array of properties to render.
        return properties;
    }
    var originalObject = null;
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

        // Clear the rendered properties.
        var $propertiesList = $("ol.properties");
        $propertiesList.empty();
        propertyValueRenderers = [];

        // Render the properties.
        var properties = getOrderedProperties
        (
            dashboard.CustomData.vaultStructureManager.getObjectClass(selectedItem.VersionData.Class),
            selectedItem.Properties
        );
        for (var i = 0; i < properties.length; i++)
        {
            var property = properties[i];

            // Get the property definition details.
            var propertyDef = dashboard.CustomData.vaultStructureManager.getPropertyDefinition(property.propertyDef);
            if (null == propertyDef)
                continue;

            // Get the property value.
            var propertyIndex = selectedItem.Properties.IndexOf(propertyDef.ID);
            if (-1 == propertyIndex)
                continue;
            var propertyValue = selectedItem.Properties[propertyIndex - 1];

            // Render.
            var propertyValueRenderer = new PropertyValueRenderer
                (
                dashboard,
                propertyDef,
                propertyValue,
                property.isRequired,
                $propertiesList
            );
            propertyValueRenderer.render();
            propertyValueRenderers.push(propertyValueRenderer);
        }
    }

    // Pass a reference back to our handler.
    if (renderer.dashboard.CustomData.registrationCallback)
        renderer.dashboard.CustomData.registrationCallback(renderer.render);

    // When the body is clicked, undo any editing.
    $("body").click(function ()
    {
        for (var i = 0; i < propertyValueRenderers.length; i++)
        {
            propertyValueRenderers[i].exitEditMode();
        }
    });

    // Configure the close button.
    $("#btnClose").click(function ()
    {
        if (typeof (dashboard.CustomData.tabClosedCallback) == "function")
            dashboard.CustomData.tabClosedCallback(true);
        if(null != dashboard.Window)
            dashboard.Window.Close();
    }).text(dashboard.CustomData.configuration.ResourceStrings.Buttons_Close || "Close");

    // Configure the save button.
    $("#btnSave").click(function ()
    {
        alert("Save not done yet.");
    }).text(dashboard.CustomData.configuration.ResourceStrings.Buttons_Save || "Save");

    // Configure the discard button.
    $("#btnDiscard").click(function ()
    {
        renderer.render(renderer.originalObject);
    }).text(dashboard.CustomData.configuration.ResourceStrings.Buttons_Discard || "Discard");

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
        var $button = $(this);
        // TODO: Change title.
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
        var $button = $(this);
        // TODO: Change title.
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
        var $button = $(this);
        // TODO: Change title.
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