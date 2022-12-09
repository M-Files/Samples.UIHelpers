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
            if (associatedPropertyDef.PropertyDef < 1000
                && associatedPropertyDef.PropertyDef != 0 // Name or title
                && associatedPropertyDef.PropertyDef != 100 // Class
                && associatedPropertyDef.PropertyDef != 26 // Keywords
                && associatedPropertyDef.PropertyDef != 102 // Repository
                && associatedPropertyDef.PropertyDef != 103) // Location
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
            if (associatedPropertyDef.PropertyDef < 1000
                && associatedPropertyDef.PropertyDef != 0 // Name or title
                && associatedPropertyDef.PropertyDef != 100 // Class
                && associatedPropertyDef.PropertyDef != 26 // Keywords
                && associatedPropertyDef.PropertyDef != 102 // Repository
                && associatedPropertyDef.PropertyDef != 103) // Location
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
    renderer.getObjectBeingRendered = function () { return renderer.originalObject; }
    renderer.getPropertyValue = function (propertyDef)
    {
        for (var i = 0; i < propertyValueRenderers.length; i++)
        {
            if (propertyValueRenderers[i].getPropertyDef().ID != propertyDef)
                continue;
            return propertyValueRenderers[i].getPropertyValue();
        }
        return null;
    }
    renderer.getCurrentValue = function (propertyDef)
    {
        for (var i = 0; i < propertyValueRenderers.length; i++)
        {
            if (propertyValueRenderers[i].getPropertyDef().ID != propertyDef)
                continue;
            return propertyValueRenderers[i].getCurrentValue();
        }
        return null;
    }
    renderer.render = function (selectedItem, force)
    {

        // Sanity.
        if (null == selectedItem)
        {
            renderer.originalObject = null;
            // Close it.
            dashboard.CustomData.tabClosedCallback(false);
            return;
        }

        // Is it the same object?
        if (renderer.originalObject != null && !force)
        {
            // If it's the same object then don't refresh.
            if (selectedItem.VersionData.ObjVer.ID == renderer.originalObject.VersionData.ObjVer.ID
                && selectedItem.VersionData.ObjVer.Type == renderer.originalObject.VersionData.ObjVer.Type
                && selectedItem.VersionData.ObjVer.Version == renderer.originalObject.VersionData.ObjVer.Version)
                return;
        }

        renderer.originalObject = selectedItem.Clone();

        // Are we editing?
        if (dashboard.CustomData.configuration.EnableEditing)
            $("body").addClass("editable");
        else
            $("body").removeClass("editable");

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
            var propertyValue = new MFiles.PropertyValue();
            propertyValue.PropertyDef = propertyDef.ID;
            propertyValue.Value.SetValueToNULL(propertyDef.DataType);
            if(-1 != propertyIndex)
                propertyValue = selectedItem.Properties[propertyIndex - 1];

            // Render.
            var propertyValueRenderer = PropertyValueRenderer.create
                (
                dashboard,
                renderer,
                propertyDef,
                propertyValue,
                property.isRequired,
                $propertiesList
            );
            propertyValueRenderer.addEventListener
                (
                    PropertyValueRenderer.EventTypes.PropertyValueChanged,
                    updateUI
                );
            var $listItem = propertyValueRenderer.render();
            if (null != $listItem)
                $listItem.focus(updateUI);
            propertyValueRenderers.push(propertyValueRenderer);
        }
    }
    function canSave()
    {
        for (var i = 0; i < propertyValueRenderers.length; i++)
        {
            // Is it valid?
            if (!propertyValueRenderers[i].isValidValue())
                return false;
        }
        return true;
    }

    // Update the UI re: save/errors.
    function updateUI()
    {
        // Stop any editing.
        $(".editing").removeClass("editing");
        $(".options-expanded").removeClass("options-expanded");

        var changedProperties = [];
        var erroredProperties = [];
        for (var i = 0; i < propertyValueRenderers.length; i++)
        {

            // Should we enable buttons and things?
            var renderer = propertyValueRenderers[i];
            if (renderer.hasChanged())
                changedProperties.push(renderer);
            if (!renderer.isValidValue())
                erroredProperties.push(renderer);

            // Attempt to exit edit mode.
            renderer.exitEditMode();
        }

        // Update the body with flags.
        $body
            .removeClass("changed")
            .removeClass("has-errors");
        $("#btnSave").removeAttr("disabled");
        if (changedProperties.length > 0)
            $body.addClass("changed");
        if (erroredProperties.length > 0)
        {
            $body.addClass("errors");
            $("#btnSave").attr("disabled", "disabled");
        }
    }

    // When the body is clicked, exit editing mode.
    var $body = $("body");
    //$body.click(updateUI);

    // Configure the close button.
    $("#btnClose").click(function ()
    {
        if (typeof (dashboard.CustomData.tabClosedCallback) == "function")
            dashboard.CustomData.tabClosedCallback(true);
        if(null != dashboard.Window)
            dashboard.Window.Close();
    }).text(dashboard.CustomData.configuration.ResourceStrings.Buttons_Close || "Close");

    renderer.saveChanges = function ()
    {
        if (!canSave())
            return false;
        var vault = dashboard.Vault;

        function getPropertyValueFromRenderer(propertyDef)
        {
            for (var i = 0; i < propertyValueRenderers.length; i++)
            {
                if (propertyValueRenderers[i].getPropertyDef().ID == propertyDef)
                    return propertyValueRenderers[i].getPropertyValue();
            }
            return null;

        }

        // Gather the properties.
        var propertyValues = new MFiles.PropertyValues();
        for (var i = 0; i < renderer.originalObject.Properties.Count; i++)
        {
            // Get the value for this property.
            var pvValue = getPropertyValueFromRenderer(renderer.originalObject.Properties[i].PropertyDef)
                || renderer.originalObject.Properties[i];

            // Add it.
            propertyValues.Add(-1, pvValue);
        }

        // Update the properties.
        try
        {
            // Set all the properties and update our cache.
            renderer.originalObject = vault.ObjectPropertyOperations.SetAllProperties(renderer.originalObject.VersionData.ObjVer, true, propertyValues);

            // By discarding the changes we'll revert to the (new) original object data.
            renderer.discardChanges();
        }
        catch (e)
        {
            MFiles.ReportException(e);
        }
    }

    // Configure the save button.
    $("#btnSave").click(function ()
    {
        renderer.saveChanges();
    }).text(dashboard.CustomData.configuration.ResourceStrings.Buttons_Save || "Save");

    renderer.discardChanges = function ()
    {
        renderer.render(renderer.originalObject, true);
        updateUI();
    }
    // Configure the discard button.
    $("#btnDiscard").click(function ()
    {
        renderer.discardChanges();
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