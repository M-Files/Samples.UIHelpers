function MultiLineTextPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent, isRemovable)
{
    var renderer = this;
    SingleLineTextPropertyValueRenderer.apply(this, arguments);
    var base = this.getBase();
    this.setOriginalValue();
    this.hasChanged = function ()
    {
        // Line ending fun.
        return (this.getCurrentValue() + "").replace(/\r\n/g, "\n")
            !== (this.getOriginalValue() + "").replace(/\r\n/g, "\n");
    }

    this.renderEditableValue = function ($parent)
    {
        var supportsEditing = this.getSupportsEditing();
        var $listItem = this.getListItem();

        // Create the value for the PV.
        var $value = $("<span></span>").addClass("editing-value");

        var $textarea = $("<textarea></textarea>").addClass("auto-select");
        $textarea.val(propertyValue.Value.DisplayValue);
        $textarea.blur(function ()
        {
            renderer.exitEditMode();
            renderer.dispatchEvent(PropertyValueRenderer.EventTypes.PropertyValueChanged);
        });
        $value.append($textarea);

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }

}
