
function LookupPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    // Set up the base object.
    PropertyValueRenderer.apply(this, arguments);
    var base = this.getBase();

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
        var supportsEditing = this.getSupportsEditing();
        if (false == supportsEditing)
            return propertyValue;

        var pv = new MFiles.PropertyValue();
        pv.PropertyDef = propertyDef.ID;

        var currentValue = this.getCurrentValue();

        if (typeof currentValue != "object")
        {
            pv.Value.SetValue(propertyDef.DataType, null);
        } else
        {
            currentValue = currentValue.id;

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
    this.getCurrentValue = function ()
    {
        var supportsEditing = this.getSupportsEditing();
        var $listItem = this.getListItem();
        if (false == supportsEditing)
        {
            if (propertyValue.Value.IsNULL())
                return "";
            return {
                id: propertyValue.Value.GetLookupID(),
                displayValue: propertyValue.Value.DisplayValue
            };
        }
        var $textEntry = $(".text-entry", $listItem);
        if (($textEntry.val() + "").length == 0)
        {
            $textEntry.data("id", "");
            $textEntry.data("displayValue", "");
            return "";
        }
        var v = $textEntry.data("id");
        if (isNaN(v) || v == 0)
            return "";
        return {
            id: v,
            displayValue: $textEntry.data("displayValue")
        };
    }
    this.isValidValue = function ()
    {
        var currentValue = this.getCurrentValue();

        if (currentValue == "")
            return !isRequired;
        return currentValue.id > 0;
    }
    this.setOriginalValue();
}