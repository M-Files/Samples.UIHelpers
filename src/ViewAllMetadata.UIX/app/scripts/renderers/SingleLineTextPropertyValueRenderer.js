function SingleLineTextPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    PropertyValueRenderer.apply(this, arguments);
    var base = this.getBase();

    this.getCurrentValue = function ()
    {
        var supportsEditing = this.getSupportsEditing();
        var $listItem = this.getListItem();
        return false == supportsEditing
            ? propertyValue.Value.DisplayValue
            : $(".auto-select", $listItem).val() + "";
    }
    this.isValidValue = function ()
    {
        var currentValue = this.getCurrentValue();

        // If it does not have a value but is required, die.
        if ((currentValue + "").length == 0 && isRequired)
            return false;

        return true;
    }
    this.setOriginalValue();
}