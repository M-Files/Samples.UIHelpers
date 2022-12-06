
function FloatingPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    PropertyValueRenderer.apply(this, arguments);
    var base = this.getBase();

    this.getCurrentValue = function ()
    {
        var supportsEditing = this.getSupportsEditing();
        var $listItem = this.getListItem();
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
    }
    this.isValidValue = function ()
    {
        var currentValue = this.getCurrentValue();

        // If it's empty then just check whether it's required.
        if ((currentValue + "").length == 0)
            return !isRequired;

        // If it's got a value, but not a number, die.
        currentValue = parseFloat(currentValue);
        if (isNaN(currentValue))
            return false;

        return true;
    }
    this.setOriginalValue();
}
