function PropertyValueRenderer(dashboard, propertyDef, propertyValue, isRequired, $parent)
{
    var renderer = this;
    var $listItem = null;
    var originalValue = getCurrentValue();
    renderer.getPropertyDef = function () { return propertyDef; }
    function getCurrentValue()
    {
        switch (propertyDef.DataType)
        {
            case MFDatatypeText:
                return null == $listItem
                    ? propertyValue.Value.DisplayValue
                    : $(".auto-select", $listItem).val() + "";
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                return null == $listItem
                    ? propertyValue.Value.DisplayValue
                    : parseFloat($(".auto-select", $listItem).val() + "");
                break;
            default:
                return propertyValue.Value.DisplayValue;
        }
    }
    renderer.getPropertyValue = function ()
    {
        switch (propertyDef.DataType)
        {
            case MFDatatypeText:
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                var pv = new MFiles.PropertyValue();
                pv.PropertyDef = propertyDef.ID;
                pv.Value.SetValue(propertyDef.DataType, getCurrentValue());
                return pv;
                break;
            default:
                return propertyValue;
        }
    }
    renderer.hasChanged = function ()
    {
        switch (propertyDef.DataType)
        {
            case MFDatatypeText:
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                return getCurrentValue() != originalValue;
                break;
            default:
                return false;
        }
    }
    renderer.isValidValue = function()
    {
        var currentValue = getCurrentValue();

        switch (propertyDef.DataType)
        {
            case MFDatatypeText:
            case MFDatatypeMultiLineText:
                if ((currentValue + "").length == 0 && isRequired)
                    return false;
                break;
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                if ((currentValue + "").length == 0 && isRequired)
                    return false;
                if (isNaN(parseFloat(currentValue)))
                    return false;
                break;
            default:
                return true;
        }
        return true;
    }

    function renderLabel($parent)
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
    function renderReadOnlyValue($parent)
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
    function renderEditableValue($parent)
    {

        // Create the value for the PV.
        var $value = $("<span></span>").addClass("editing-value");

        // Render each data type.
        switch (propertyDef.DataType)
        {
            case MFDatatypeText:
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                var $input = $("<input type='text' maxlength='100' />").addClass("auto-select");
                $input.val(propertyValue.Value.DisplayValue);
                $input.blur(function () { renderer.exitEditMode(); });
                $value.append($input);

                // If it's a number then set the input mode.
                // Note: this doesn't do anything currently, but maybe in the future...
                if (propertyDef.DataType != MFDatatypeText)
                {
                    $input.val(parseFloat(propertyValue.Value.DisplayValue));
                    $input.attr("inputmode", "numeric");
                    var pattern = "[0-9]*"; // Default to allowing just numbers.
                    if (propertyDef.DataType == MFDatatypeFloating)
                    {
                        pattern = "[0-9\.\,]*"; // Allow decimal separators too.
                    }
                    $input.attr("pattern", pattern);
                }

                break;
            default:
                return null;
        }

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }

    renderer.enterEditMode = function ()
    {
        // No editing?  Die.
        if (!dashboard.CustomData.configuration.EnableEditing)
            return;
        if (null == $listItem)
            return;
        $listItem.addClass("editing");
        $(".auto-select", $listItem).select();
    }
    renderer.exitEditMode = function ()
    {
        // No editing?  Die.
        if (!dashboard.CustomData.configuration.EnableEditing)
            return;
        switch (propertyDef.DataType)
        {
            case MFDatatypeText:
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                // If it's invalid then mark the list item.
                if (!renderer.isValidValue())
                {
                    if (null != $listItem)
                        $listItem.addClass("invalid-value")
                    return false;
                }

                // We're good.
                if (null != $listItem)
                    $listItem.removeClass("invalid-value")

                // Set the value.
                var value = getCurrentValue();

                // Update the UI.
                if (value.length == 0)
                    value = "---";
                $(".read-only-value", $listItem).text(value);
                break;
        }
        $listItem.removeClass("editing");
        return true;
    }

    renderer.render = function ()
    {
        // Create the (parent) list item.
        $listItem = $("<li></li>");
        $listItem.addClass("mfdatatype-" + propertyDef.DataType.toString()); // Add a class for the data type
        $listItem.data("propertyDef", propertyDef);
        $listItem.data("propertyValue", propertyValue);

        // Create the label.
        renderLabel( $listItem);

        // Create the read-only value.
        renderReadOnlyValue($listItem);

        // Is editing enabled?
        if (dashboard.CustomData.configuration.EnableEditing)
        {

            // Is the property editable?
            if (propertyDef.AutomaticValueType == MFAutomaticValueTypeNone)
            {
                // Attempt to create the editable value.
                var $editableValue = renderEditableValue($listItem);
                if (null != $editableValue)
                {
                    // Mark it as editable.
                    $listItem.addClass("editable");

                    // Add the handler to allow editing.
                    $listItem.click(function (e)
                    {
                        $(".editing").removeClass("editing");
                        renderer.enterEditMode();
                        e.stopPropagation();
                        return false;
                    });
                }
            }

        }

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($listItem);


        return $listItem;
    }

    return renderer;
}