
function TimestampPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent, isRemovable)
{
    PropertyValueRenderer.apply(this, arguments);

    var base = this.getBase();

    this.getCurrentValue = function ()
    {
        var supportsEditing = this.getSupportsEditing();
        var $listItem = this.getListItem();
        return false == supportsEditing
            ? propertyValue.Value.DisplayValue
            : $(".auto-select", $listItem).val();
    }
    this.getPropertyValue = function ()
    {
        var supportsEditing = this.getSupportsEditing();
        if (false == supportsEditing)
            return propertyValue;

        var currentValue = this.getCurrentValue();
        if ((currentValue + "").length > 0)
        {
            currentValue = dayjs(currentValue, this.getLocaleDateString(false) + " HH:mm").utc().format("YYYY-MM-DD HH:mm:ss")
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

        var format = this.getLocaleDateString(true) + " H:i";
        $input.datetimepicker
            (
                {
                    datepicker: true,
                    timepicker: true,
                    value: propertyValue.Value.DisplayValue,
                    mask: true,
                    format: format,
                    step: 1
                }
            );

        return $value
    }
}
