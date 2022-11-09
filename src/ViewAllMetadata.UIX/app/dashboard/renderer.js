function Renderer(dashboard)
{
    var t = this;
    t.dashboard = dashboard;
    function renderLabel(propertyDef, propertyValue, isRequired, $parent)
    {
        // Create the label for the PV.
        var $label = $("<label></label>");
        if (isRequired)
            $label.addClass("mandatory");
        var $labelSpan = $("<span></span>");
        $labelSpan.text(propertyDef.Name);
        $label.append($labelSpan);

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($label);

        return $label;
    }
    function renderReadOnlyValue(propertyDef, propertyValue, isRequired, $parent)
    {

        // Create the value for the PV.
        var $value = $("<span></span>").addClass("read-only-value");
        var value = propertyValue.Value.DisplayValue;
        if ((value + "").length == 0)
            value = "---";
        $value.text(value);

        // Do any special processing for different data types.
        switch (propertyDef.DataType)
        {
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
                    $value.empty().append(value);
                }
                break;
        }

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }
    function renderEditableValue(propertyDef, propertyValue, isRequired, $parent)
    {

        // Create the value for the PV.
        var $value = $("<span></span>").addClass("editing-value");

        // Render each data type.
        switch (propertyDef.DataType)
        {
            case MFDatatypeText:
                var $input = $("<input type='text' />").addClass("auto-select");
                $input.val(propertyValue.Value.DisplayValue);
                $value.append($input);
                break;
        }

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }
    t.renderPropertyValue = function (propertyDef, propertyValue, isRequired, $parent)
    {
        // Create the (parent) list item.
        var $listItem = $("<li></li>");
        $listItem.addClass("mfdatatype-" + propertyDef.DataType.toString()); // Add a class for the data type
        $listItem.data("propertyDef", propertyDef);
        $listItem.data("propertyValue", propertyValue);

        // Create the label.
        renderLabel(propertyDef, propertyValue, isRequired, $listItem);

        // Create the read-only value.
        renderReadOnlyValue(propertyDef, propertyValue, isRequired, $listItem);

        // Is the property editable?
        if (propertyDef.AutomaticValueType == MFAutomaticValueTypeNone)
        {
            // Mark it as editable.
            $listItem.addClass("editable");

            // For now only deal with text properties, as that's all we support.
            if (propertyDef.DataType == 1)
            {

                // Create the editable value.
                renderEditableValue(propertyDef, propertyValue, isRequired, $listItem);

                // Add the handler to allow editing.
                $listItem.click(function (e)
                {
                    $(".editing").removeClass("editing");
                    $listItem.addClass("editing");
                    $(".auto-select", $listItem).select();
                    e.stopPropagation();
                    return false;
                });
            }
        }

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($listItem);


        return $listItem;
    }
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

        // Render the properties.
        var properties = getOrderedProperties
        (
            dashboard.CustomData.getObjectClass(selectedItem.VersionData.Class),
            selectedItem.Properties
        );
        for (var i = 0; i < properties.length; i++)
        {
            var property = properties[i];

            // Get the property definition details.
            var propertyDef = dashboard.CustomData.getPropertyDefinition(property.propertyDef);
            if (null == propertyDef)
                continue;

            // Get the property value.
            var propertyIndex = selectedItem.Properties.IndexOf(propertyDef.ID);
            if (-1 == propertyIndex)
                continue;
            var propertyValue = selectedItem.Properties[propertyIndex - 1];

            // Render.
            t.renderPropertyValue
                (
                    propertyDef,
                    propertyValue,
                    property.isRequired,
                    $propertiesList
                );
        }
    }

    // Pass a reference back to our handler.
    if (t.dashboard.CustomData.registrationCallback)
        t.dashboard.CustomData.registrationCallback(t.renderObject);

    // Render any selected item.
    if (t.dashboard.CustomData.selectedItem)
        t.renderObject(dashboard.CustomData.selectedItem);

    $("body").click(function ()
    {
        $(".editing").removeClass("editing");
    });

    return t;
}