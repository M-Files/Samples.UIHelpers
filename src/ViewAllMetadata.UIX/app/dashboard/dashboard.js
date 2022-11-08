"use strict";

function OnNewDashboard(dashboard)
{
    /// <summary>The entry point of Dashboard.</summary>
    /// <param name="dashboard" type="MFiles.Dashboard">The new Dashboard object.</param>

    // Parent is a shell pane container (tab), when dashboard is shown in right pane.
    var shellUI = dashboard.Parent.ShellFrame.ShellUI;

    // Initialize console.
    console.initialize(shellUI, "Show all metadata (dashboard)");

    // Configure the close button.
    $("#btnClose").click(function ()
    {
        if (typeof (dashboard.CustomData.tabClosedCallback) == "function")
            dashboard.CustomData.tabClosedCallback();
    })

    // Pass a reference back to our handler.
    dashboard.CustomData.registrationCallback(handleNewSelectedItem);

    // Handle any selected item.
    handleNewSelectedItem(dashboard.CustomData.selectedItem)

    function renderPropertyValue(propertyDef, propertyValue, isRequired)
    {
        // Create the label for the PV.
        var $label = $("<label></label>");
        if (isRequired)
            $label.addClass("mandatory");
        var $labelSpan = $("<span></span>");
        $labelSpan.text(propertyDef.Name);
        $label.append($labelSpan)

        // Create the value for the PV.
        var $valueSpan = $("<span></span>");
        var value = propertyValue.Value.DisplayValue;
        if ((value + "").length == 0)
            value = "---";
        $valueSpan.text(value);

        // Build up the list item.
        var $listItem = $("<li></li>");
        switch (propertyDef.DataType)
        {
            case MFDatatypeText:
                $listItem.addClass("text");
                break;
            case MFDatatypeMultiLineText:
                $listItem.addClass("multi-line-text");
                break;
            case MFDatatypeMultiSelectLookup:
                // Get the data out the lookups.
                var lookups = propertyValue.Value.GetValueAsLookups();
                value = $("<div></div>");
                for (var i = 0; i < lookups.Count; i++)
                {
                    value.append($("<div></div>").text(lookups[i].DisplayValue));
                }
                $valueSpan.empty().append(value);
                break;
        }
        $listItem.append($label);
        $listItem.append($valueSpan);

        return $listItem;
    }

    function handleNewSelectedItem(selectedItem)
    {
        // Sanity.
        if (null == selectedItem)
        {
            // TODO: Set to empty.
            return;
        }

        // Set the title.
        $("#title").text(selectedItem.VersionData.Title)

        // Clear the rendered properties.
        var $propertiesList = $("ol.properties");
        $propertiesList.empty();
        var renderedPropertyDefs = [];

        // Render class.
        if (1 == 1)
        {
            // Get the index of the property in the collection.
            var propertyIndex = selectedItem.Properties.IndexOf(100)
            if (-1 == propertyIndex)
                return;

            // Mark this as rendered.
            renderedPropertyDefs.push(100);

            // Get the property definition details.
            var propertyDef = dashboard.CustomData.getPropertyDefinition(100);
            if (null == propertyDef)
                return;

            // Render.
            $propertiesList.append
                (
                    renderPropertyValue
                        (
                            propertyDef,
                            selectedItem.Properties[propertyIndex - 1],
                            true
                        )
                );
        }

        // Render the class associated properties, in order.
        var objectClass = dashboard.CustomData.getObjectClass(selectedItem.VersionData.Class);
        if (null == objectClass)
            return;
        for (var i = 0; i < objectClass.AssociatedPropertyDefs.Count; i++)
        {
            // Get details about this property on this class (e.g. is it mandatory?).
            var associatedPropertyDef = objectClass.AssociatedPropertyDefs[i];

            // Skip built-in properties.
            if (associatedPropertyDef.PropertyDef < 1000 && associatedPropertyDef.PropertyDef != 0 && associatedPropertyDef.PropertyDef != 100)
                continue;

            // Get the index of the property in the collection.
            var propertyIndex = selectedItem.Properties.IndexOf(associatedPropertyDef.PropertyDef)
            if (-1 == propertyIndex)
                continue;

            // Mark this as rendered.
            renderedPropertyDefs.push(associatedPropertyDef.PropertyDef);

            // Get the property definition details.
            var propertyDef = dashboard.CustomData.getPropertyDefinition(associatedPropertyDef.PropertyDef);
            if (null == propertyDef)
                continue;

            // Render.
            $propertiesList.append
            (
                renderPropertyValue
                (
                    propertyDef,
                    selectedItem.Properties[propertyIndex - 1],
                    associatedPropertyDef.Required || propertyDef == 100
                )
            );
        }

        // Render anything that's left.
        for (var i = 0; i < selectedItem.Properties.Count; i++)
        {
            var p = selectedItem.Properties[i];

            // Skip rendered ones.
            if (renderedPropertyDefs.indexOf(p.PropertyDef) > -1)
                continue;

            // Skip built-in properties.
            if (p.PropertyDef < 1000 && p.PropertyDef != 0 && p.PropertyDef != 100)
                continue;

            // Get the property definition details.
            var propertyDef = dashboard.CustomData.getPropertyDefinition(p.PropertyDef);
            if (null == propertyDef)
                continue;

            // Render.
            $propertiesList.append(renderPropertyValue(propertyDef, p, false));
        }
    }
}