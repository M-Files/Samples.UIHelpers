function PropertyValueRenderer(propertyDef, propertyValue, isRequired, $parent)
{
    var renderer = this;
    var $listItem = null;

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
                var $input = $("<input type='text' />").addClass("auto-select");
                $input.val(propertyValue.Value.DisplayValue);
                $input.blur(function () { renderer.exitEditMode(); });
                $value.append($input);
                break;
        }

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }

    renderer.enterEditMode = function ()
    {
        if (null == $listItem)
            return;
        $listItem.addClass("editing");
        $(".auto-select", $listItem).select();
    }
    renderer.exitEditMode = function ()
    {
        switch (propertyDef.DataType)
        {
            case MFDatatypeText:
                var value = $(".auto-select", $listItem).val();
                if ((value + "").length == 0)
                    value = "---";
                $(".read-only-value", $listItem).text(value);
                break;
        }
        $listItem.removeClass("editing");
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

        // Is the property editable?
        if (propertyDef.AutomaticValueType == MFAutomaticValueTypeNone)
        {
            // Mark it as editable.
            $listItem.addClass("editable");

            // For now only deal with text properties, as that's all we support.
            if (propertyDef.DataType == 1)
            {

                // Create the editable value.
                renderEditableValue($listItem);

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

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($listItem);


        return $listItem;
    }

    return renderer;
}