
function LookupPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    PropertyValueRenderer.apply(this, arguments);
    var base =
    {
        renderReadOnlyValue: this.renderReadOnlyValue,
        getPropertyValue: this.getPropertyValue
    };
    this.renderReadOnlyValue = function ($parent)
    {
        var $listItem = this.getListItem();
        var $value = base.renderReadOnlyValue.apply(this, [$parent]);
        var value = this.getCurrentValue();
        if ((value + "").length == 0)
        {
            $listItem.addClass("empty");
            $value.text("---");
            return $value;
        }
        $value.text(value.displayValue);
        return $value;
    }
    this.getPropertyValue = function ()
    {
        if (false == supportsEditing)
            return propertyValue;

        var pv = base.getPropertyValue.apply(this, []);
        var currentValue = this.getCurrentValue();

        if (typeof currentValue != "object")
        {
            pv.Value.SetValue(propertyDef.DataType, null);
        } else
        {
            pv.Value.SetValue(propertyDef.DataType, currentValue.id);
        }
        return pv;
    }
}