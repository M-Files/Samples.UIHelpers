
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
}

PropertyValueRenderer.create = function (dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    switch (propertyDef.DataType)
    {
        case MFDatatypeMultiSelectLookup:
            return new MultiSelectLookupPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent);
        case MFDatatypeLookup:
            return new LookupPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent);
        case MFDatatypeTimestamp:
            return new TimestampPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent);
        case MFDatatypeTime:
            return new TimePropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent);
        case MFDatatypeDate:
            return new DatePropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent);
        case MFDatatypeBoolean:
            return new BooleanPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent);
        case MFDatatypeInteger:
            return new IntegerPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent);
        case MFDatatypeFloating:
            return new FloatingPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent);
        case MFDatatypeMultiLineText:
            return new MultiLineTextPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent);
        case MFDatatypeText:
            return new SingleLineTextPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent);
        default:
            alert("Property datatype " + propertyDef.DataType + " not handled; rendering may fail.");
            return new PropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent);
    }
}