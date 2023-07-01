
function DatePropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent, isRemovable)
{
    PropertyValueRenderer.apply(this, arguments);
    var base = this.getBase();

    this.getCurrentValue = function ()
    {
        var supportsEditing = this.getSupportsEditing();
        var $listItem = this.getListItem();
        var v = false == supportsEditing
            ? propertyValue.Value.DisplayValue
            : $(".auto-select", $listItem).val();
        if (v == "__/__/____") // Happens when tabbing through the field; just get the mask.
            v = "";
        return v;
    }
    this.getPropertyValue = function ()
    {
        var supportsEditing = this.getSupportsEditing();
        if (false == supportsEditing)
            return propertyValue;

        var currentValue = this.getCurrentValue();
        if ((currentValue + "").length > 0)
        {
            currentValue = dayjs(currentValue, this.getLocaleDateString(false)).utc().format("YYYY-MM-DD")
        }

        var pv = new MFiles.PropertyValue();
        pv.PropertyDef = propertyDef.ID;
        if ((currentValue + "").length == 0)
        {
            pv.Value.SetValue(propertyDef.DataType, null);
        }
        else
        {
            try
            {
                pv.Value.SetValue(propertyDef.DataType, currentValue);
            }
            catch (e)
            {
                alert("Could not set value of " + currentValue + " for property " + propertyDef.Name);
            }
        }
        return pv;
    }
    this.setOriginalValue();

    this.renderEditableValue = function ($parent)
    {
        var $value = base.renderEditableValue.call(this, $parent);
        if (null == $value)
            return $value;
        var $input = $(".auto-select", $value);

        var format = this.getLocaleDateString(true);
        $input.datetimepicker
            (
                {
                    timepicker: false,
                    value: propertyValue.Value.DisplayValue,
                    format: format,
                    mask: true
                }
            );

        return $value
    }
}
