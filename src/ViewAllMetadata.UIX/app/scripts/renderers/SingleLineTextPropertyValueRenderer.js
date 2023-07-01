function SingleLineTextPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent, isRemovable)
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
    this.setOriginalValue();
}