function Renderer(dashboard)
{
    var t = this;
    t.dashboard = dashboard;

    t.renderPropertyValue = function (propertyDef, propertyValue, isRequired, $parent)
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
                // Only replace the value if we have something (otherwise leave as "---").
                if (lookups.Count > 0)
                {
                    value = $("<div></div>");
                    for (var i = 0; i < lookups.Count; i++)
                    {
                        value.append($("<div></div>").text(lookups[i].DisplayValue));
                    }
                    $valueSpan.empty().append(value);
                }
                break;
        }
        $listItem.append($label);
        $listItem.append($valueSpan);

        // Is the property editable?
        if (propertyDef.AutomaticValueType == MFAutomaticValueTypeNone)
        {
            $listItem.addClass("editable");
        }

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($listItem);

        return $listItem;
    }
    t.renderObject = function (selectedItem)
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
            t.renderPropertyValue
                (
                    propertyDef,
                    selectedItem.Properties[propertyIndex - 1],
                    true,
                    $propertiesList
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
            t.renderPropertyValue
                (
                    propertyDef,
                    selectedItem.Properties[propertyIndex - 1],
                    associatedPropertyDef.Required || propertyDef == 100,
                    $propertiesList
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

            // If this is the name or title and we have another property set for that on the class then skip.
            if (p.propertyDef == 0 && objectClass.NamePropertyDef > 0)
                continue;

            // Get the property definition details.
            var propertyDef = dashboard.CustomData.getPropertyDefinition(p.PropertyDef);
            if (null == propertyDef)
                continue;

            // Render.
            t.renderPropertyValue
                (
                    propertyDef,
                    p,
                    false,
                    $propertiesList
                );
        }
    }

    // Pass a reference back to our handler.
    if (t.dashboard.CustomData.registrationCallback)
        t.dashboard.CustomData.registrationCallback(t.renderObject);

    // Render any selected item.
    if(t.dashboard.CustomData.selectedItem)
        t.renderObject(dashboard.CustomData.selectedItem)

    return t;
}