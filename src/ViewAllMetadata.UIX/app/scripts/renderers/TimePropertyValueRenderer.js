
function TimePropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent, isRemovable)
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
        if (v == "__:__:__") // Happens when tabbing through the field; just get the mask.
            v = "";
        return v;
    }
    this.setOriginalValue();

    this.renderEditableValue = function ($parent)
    {
        var $value = base.renderEditableValue.call(this, $parent);
        if (null == $value)
            return $value;
        var $input = $(".auto-select", $value);

        $input.datetimepicker
            (
                {
                    datepicker: false,
                    timepicker: true,
                    value: propertyValue.Value.DisplayValue,
                    mask: true,
                    format: 'H:i',
                    step: 1
                }
            );

        return $value
    }
}
