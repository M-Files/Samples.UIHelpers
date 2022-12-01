function PropertyValueRenderer(dashboard, propertyDef, propertyValue, isRequired, $parent)
{
    var renderer = this;
    var $listItem = null;
    var supportsEditing = false;
    var originalValue = getCurrentValue();
    renderer.getPropertyDef = function () { return propertyDef; }
    function getCurrentValue()
    {
        switch (propertyDef.DataType)
        {
            case MFDatatypeBoolean:
                var v = false == supportsEditing
                    ? propertyValue.Value.DisplayValue
                    : $(".auto-select", $listItem).val();
                switch ((v + "").toLowerCase())
                {
                    case "true":
                    case "yes":
                        return true;
                    case "false":
                    case "no":
                        return false;
                    default:
                        // No value.
                        return "";
                }
            case MFDatatypeText:
            case MFDatatypeMultiLineText:
                return false == supportsEditing
                    ? propertyValue.Value.DisplayValue
                    : $(".auto-select", $listItem).val() + "";
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                var v = false == supportsEditing
                    ? propertyValue.Value.DisplayValue
                    : $(".auto-select", $listItem).val() + "";
                if ((v + "").length > 0)
                {
                    var x = parseFloat(v);
                    if (!isNaN(x))
                        v = x;
                }
                return v;
            default:
                return propertyValue.Value.DisplayValue;
        }
    }
    renderer.getPropertyValue = function ()
    {
        if (false == supportsEditing)
            return propertyValue;
        switch (propertyDef.DataType)
        {
            case MFDatatypeBoolean:
                var currentValue = getCurrentValue();
                var pv = new MFiles.PropertyValue();
                pv.PropertyDef = propertyDef.ID;
                if ((currentValue + "").length == 0)
                {
                    pv.Value.SetValue(propertyDef.DataType, null);
                }
                else
                {
                    pv.Value.SetValue(propertyDef.DataType, currentValue);
                }
                return pv;
            case MFDatatypeText:
            case MFDatatypeMultiLineText:
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                var pv = new MFiles.PropertyValue();
                pv.PropertyDef = propertyDef.ID;
                pv.Value.SetValue(propertyDef.DataType, getCurrentValue());
                return pv;
            default:
                return propertyValue;
        }
    }
    renderer.hasChanged = function ()
    {
        var currentValue = getCurrentValue();
        switch (propertyDef.DataType)
        {
            case MFDatatypeBoolean:
            case MFDatatypeText:
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                return currentValue !== originalValue;
            case MFDatatypeMultiLineText:
                // Line ending fun.
                return (currentValue + "").replace(/\r\n/g, "\n") !== (originalValue + "").replace(/\r\n/g, "\n");
            default:
                return false;
        }
    }
    renderer.isValidValue = function()
    {
        var currentValue = getCurrentValue();

        switch (propertyDef.DataType)
        {
            case MFDatatypeBoolean:
                switch ((currentValue + "").toLowerCase())
                {
                    case "true":
                    case "false":
                    case "":
                        return true;
                    default:
                        return !isRequired;
                }
            case MFDatatypeText:
            case MFDatatypeMultiLineText:
                // If it does not have a value but is required, die.
                if ((currentValue + "").length == 0 && isRequired)
                    return false;
                break;
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                // If it's empty then just check whether it's required.
                if ((currentValue + "").length == 0)
                    return !isRequired;

                // If it's got a value, but not a number, die.
                currentValue = parseFloat(currentValue);
                if (isNaN(currentValue))
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
        {
            $listItem.addClass("empty");
            value = "---";
        }
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
            case MFDatatypeBoolean:
                var $select = $("<select></select>").addClass("auto-select");
                var $emptyOption = $("<option></option>").val("").text("");
                var $yesOption = $("<option></option>").val("Yes").text("Yes");
                var $noOption = $("<option></option>").val("No").text("No");
                switch ((propertyValue.Value.DisplayValue + "").toLowerCase())
                {
                    case "true":
                    case "yes":
                        $yesOption.attr("selected", "selected");
                        break;
                    case "false":
                    case "no":
                        $noOption.attr("selected", "selected");
                        break;
                }
                $select.append($emptyOption);
                $select.append($yesOption);
                $select.append($noOption);
                $select.change(function () { renderer.exitEditMode(); });
                $value.append($select);
                break;
            case MFDatatypeMultiLineText:
                var $textarea = $("<textarea></textarea>").addClass("auto-select");
                $textarea.val(propertyValue.Value.DisplayValue);
                $textarea.blur(function () { renderer.exitEditMode(); });
                $value.append($textarea);
                break;
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
                    $input.val(propertyValue.Value.DisplayValue);
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
        // Already editing?
        if ($listItem.hasClass("editing"))
            return;

        // Start editing.
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
            case MFDatatypeBoolean:
            case MFDatatypeText:
            case MFDatatypeMultiLineText:
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

                // Format the value.
                switch (propertyDef.DataType)
                {
                    case MFDatatypeBoolean:
                        switch (value)
                        {
                            case true:
                                value = "Yes";
                                break;
                            case false:
                                value = "No";
                                break;
                            default:
                                value = "";
                        }
                        break;
                }

                // Update the UI.
                if (null != $listItem)
                    $listItem.removeClass("empty");
                if ((value + "").length == 0)
                {
                    if (null != $listItem)
                        $listItem.addClass("empty");
                    value = "---";
                }
                $(".read-only-value", $listItem).text(value);
                break;
        }
        if (null != $listItem)
            $listItem.removeClass("editing");
        return true;
    }

    renderer.render = function ()
    {
        // Create the (parent) list item.
        $listItem = $("<li></li>");
        $listItem.attr("tabindex", "0");
        $listItem.addClass("mfdatatype-" + propertyDef.DataType.toString()); // Add a class for the data type
        $listItem.data("propertyDef", propertyDef);
        $listItem.data("propertyValue", propertyValue);

        // Create the label.
        renderLabel($listItem);

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
                    supportsEditing = true;
                    $listItem.addClass("editable");

                    // Add the handler to allow editing.
                    $listItem.click(function (e)
                    {
                        $(".editing").removeClass("editing");
                        renderer.enterEditMode();
                        e.stopPropagation();
                        return false;
                    });
                    $listItem.focus(function (e)
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