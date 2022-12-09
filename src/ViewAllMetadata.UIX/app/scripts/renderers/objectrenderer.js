﻿function ObjectRenderer(dashboard)
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
            if (p.PropertyDef < 1000
                && p.PropertyDef != 0 // Name or title
                && p.PropertyDef != 100 // Class
                && p.PropertyDef != 26 // Keywords
                && p.PropertyDef != 102 // Repository
                && p.PropertyDef != 103) // Location
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
    renderer.render = function (selectedItem, force, keepPropertyData)
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
        var isSameObject = false;
        if (renderer.originalObject != null)
        {
            // If it's the same object then don't refresh.
            isSameObject = (selectedItem.VersionData.ObjVer.ID == renderer.originalObject.VersionData.ObjVer.ID
                && selectedItem.VersionData.ObjVer.Type == renderer.originalObject.VersionData.ObjVer.Type
                && selectedItem.VersionData.ObjVer.Version == renderer.originalObject.VersionData.ObjVer.Version);
        }
        if (isSameObject && !force)
            return;
        if (!isSameObject)
            keepPropertyData = false;

        renderer.originalObject = selectedItem.Clone();

        // Are we editing?
        if (dashboard.CustomData.configuration.EnableEditing)
            $("body").addClass("editable");
        else
            $("body").removeClass("editable");

        // Set the title.
        $("#title").text(selectedItem.VersionData.Title)

        // Get the class of the object.
        var objectClass = renderer.getPropertyValue(100);
        if (!keepPropertyData || null == objectClass || null == objectClass.Value || objectClass.Value.IsNULL())
            objectClass = selectedItem.VersionData.Class
        else
            objectClass = objectClass.Value.GetLookupID();

        // If we keep the property data then try to do so.
        var selectedItemProperties = selectedItem.Properties;
        if (keepPropertyData)
        {
            selectedItemProperties = new MFiles.PropertyValues();
            for (var i = 0; i < propertyValueRenderers.length; i++) 
            {
                var pv = propertyValueRenderers[i].getPropertyValue();
                if (null != pv)
                    selectedItemProperties.Add(-1, pv);
            }
        }

        // Clear the rendered properties.
        var $propertiesList = $("ol.properties");
        $propertiesList.empty();
        propertyValueRenderers = [];

        // Render the properties.
        var properties = getOrderedProperties
        (
            dashboard.CustomData.vaultStructureManager.getObjectClass(objectClass),
            selectedItemProperties
        );
        for (var i = 0; i < properties.length; i++)
        {
            var property = properties[i];

            // Get the property definition details.
            var propertyDef = dashboard.CustomData.vaultStructureManager.getPropertyDefinition(property.propertyDef);
            if (null == propertyDef)
                continue;

            // Get the property value.
            var propertyIndex = selectedItemProperties.IndexOf(propertyDef.ID);
            var propertyValue = new MFiles.PropertyValue();
            propertyValue.PropertyDef = propertyDef.ID;
            propertyValue.Value.SetValueToNULL(propertyDef.DataType);
            if(-1 != propertyIndex)
                propertyValue = selectedItemProperties[propertyIndex - 1];

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
                    function ()
                    {
                        // Re-render if the class changes.
                        if (this.getPropertyDef().ID == 100)
                            renderer.render(renderer.originalObject, true, true);

                        // Update the UI.
                        updateUI();
                    }
                );
            propertyValueRenderer.render();
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
    function updateUI(stopAllEditing)
    {
        // Stop any editing.
        if (stopAllEditing)
        {
            $(".editing").removeClass("editing");
            $(".options-expanded").removeClass("options-expanded");
        }

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
            if (stopAllEditing)
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
    $body.click(function () { updateUI(true); });

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

        // Get the original object properties.
        var propertyValues = renderer.originalObject.Properties;

        // Gather the properties.
        for (var i = 0; i < propertyValueRenderers.length; i++)
        {

            // Get the value for this property.
            var pv = propertyValueRenderers[i].getPropertyValue();

            // If the collection contains a value then remove it.
            var index = propertyValues.IndexOf(pv.PropertyDef);
            if (index > -1)
                propertyValues.Remove(index);

            // Add it.
            if(null != pv)
                propertyValues.Add(index, pv);
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
        updateUI(true);
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