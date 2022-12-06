
function MultiSelectLookupPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    var renderer = this;
    LookupPropertyValueRenderer.apply(this, arguments);
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
    this.getCurrentValue = function ()
    {
        var supportsEditing = this.getSupportsEditing();
        var $listItem = this.getListItem();
        var arr = [];
        if (false == supportsEditing)
        {
            if (propertyValue.Value.IsNULL())
                return "";
            var lookups = propertyValue.Value.GetValueAsLookups();
            for (var i = 0; i < lookups.Count; i++) {
                arr.push({
                    id: lookups[i].Item,
                    displayValue: lookups[i].DisplayValue || "(hidden)"
                })
            }
            return arr;
        }

        // Get data from values.
        var $textEntries = $(".text-entry", $listItem);
        for (var i = 0; i < $textEntries.length; i++)
        {
            var $textEntry = $($textEntries.get(i));
            if (($textEntry.val() + "").length == 0)
            {
                $textEntry.data("id", "");
                $textEntry.data("displayValue", "");
                continue;
            }
            var v = $textEntry.data("id");
            if (isNaN(v) || v == 0)
                continue;
            arr.push( {
                id: v,
                displayValue: $textEntry.data("displayValue")
            });
        }
        return arr;
    }
    this.setOriginalValue();
    this.hasChanged = function ()
    {
        var currentValue = this.getCurrentValue();
        var originalValue = this.getOriginalValue();

        // TODO: Check arrays.
        return true;
    }
    this.isValidValue = function ()
    {
        // If we have a value, awesome.
        var currentValue = this.getCurrentValue();
        if (currentValue.length > 0)
            return true;

        // Otherwise check isRequired.
        return !isRequired;
    }
    this.getPropertyValue = function ()
    {
        var supportsEditing = this.getSupportsEditing();
        if (false == supportsEditing)
            return propertyValue;

        var pv = new MFiles.PropertyValue();
        pv.PropertyDef = propertyDef.ID;

        var currentValue = this.getCurrentValue();

        if (currentValue.length == 0)
        {
            pv.Value.SetValue(propertyDef.DataType, null);
        }
        else
        {
            var lookups = new MFiles.Lookups();
            for (var i = 0; i < currentValue.length; i++)
            {
                var lookup = new MFiles.Lookup();
                lookup.Item = currentValue[i].id;
                lookups.Add(-1, lookup);
            }

            try
            {
                pv.Value.SetValueToMultiSelectLookup(lookups);
            }
            catch (e)
            {
                alert("Could not set value of " + lookups + " for property " + propertyDef.Name);
            }
        }
        return pv;
    }

    this.renderEditableValue = function ($parent)
    {
        var supportsEditing = this.getSupportsEditing();
        var $listItem = this.getListItem();

        // Create the value for the PV.
        var $value = $("<span></span>").addClass("editing-value");

        // Render existing items.
        var currentValue = this.getCurrentValue();
        if (currentValue.length > 0)
        {
            for (var i = 0; i < currentValue.length; i++)
            {
                renderer.renderSingleLookupOption
                    (
                        $listItem,
                        $value,
                        currentValue[i].id,
                        currentValue[i].displayValue
                    );
            }
        }

        // Render "add new" item.
        renderer.renderSingleLookupOption
            (
                $listItem,
                $value,
                null,
                null
            );

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }
}
