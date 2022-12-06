
function MultiSelectLookupPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    PropertyValueRenderer.apply(this, arguments);
    var base =
    {
        renderReadOnlyValue: this.renderReadOnlyValue
    };
    this.renderReadOnlyValue = function ($parent)
    {
        var $listItem = this.getListItem();
        var $value = base.renderReadOnlyValue.apply(this, [$parent]);
        var value = this.getCurrentValue();

        // Get the data out the lookups.
        var lookups = propertyValue.Value.GetValueAsLookups();

        // Only replace the value if we have something (otherwise leave as "---").
        if (lookups.Count > 0)
        {
            value = $("<div></div>");
            for (var i = 0; i < lookups.Count; i++)
            {
                value.append($("<div></div>").text(lookups[i].DisplayValue));
            }
            $value.empty().append(value);
        }
        else
        {
            $listItem.addClass("empty");
        }

        return $value;

    }
    this.setOriginalValue();
    this.exitEditMode = function () { };
    this.getPropertyValue = function ()
    {
        return propertyValue;
    }
    this.renderEditableValue = function ($parent)
    {
        return null;
    }
}
