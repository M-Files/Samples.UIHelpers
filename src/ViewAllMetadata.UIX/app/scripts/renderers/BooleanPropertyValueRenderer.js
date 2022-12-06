
function BooleanPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
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
    }
    this.isValidValue = function ()
    {
        var currentValue = this.getCurrentValue();
        switch ((currentValue + "").toLowerCase())
        {
            case "true":
            case "false":
            case "":
                return true;
            default:
                return !isRequired;
        }
    }
    this.setOriginalValue();
}