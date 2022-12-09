
function BooleanPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    var renderer = this;
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
    this.renderReadOnlyValue = function ()
    {
        var $listItem = this.getListItem();
        var $value = base.renderReadOnlyValue.apply(this, []);

        // Set the value.
        var value = this.getCurrentValue();
        switch (value)
        {
            case true:
                value = "Yes";
                break;
            case false:
                value = "No";
                break;
            default:
                value = "";
        }

        if ((value + "").length == 0)
        {
            $listItem.addClass("empty");
            $value.text("---");
            return $value;
        }
        $value.text(value);
        return $value;
    }
    this.renderEditableValue = function ($parent)
    {
        var supportsEditing = this.getSupportsEditing();
        var $listItem = this.getListItem();

        // Create the value for the PV.
        var $value = $("<span></span>").addClass("editing-value");

        var $select = $("<select></select>").addClass("auto-select");
        var $emptyOption = $("<option></option>").val("").text("");
        var $yesOption = $("<option></option>").val("Yes").text("Yes");
        var $noOption = $("<option></option>").val("No").text("No");
        switch ((propertyValue.Value.DisplayValue + "").toLowerCase())
        {
            case "true":
            case "yes":
                $yesOption.attr("selected", "selected");
                break;
            case "false":
            case "no":
                $noOption.attr("selected", "selected");
                break;
        }
        $select.append($emptyOption);
        $select.append($yesOption);
        $select.append($noOption);
        $select.change(function ()
        {
            renderer.dispatchEvent(PropertyValueRenderer.EventTypes.PropertyValueChanged);
        });
        $value.append($select);

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }

}