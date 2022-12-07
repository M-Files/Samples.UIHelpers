
function IntegerPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    FloatingPropertyValueRenderer.apply(this, arguments);
    var base = this.getBase();

    this.getCurrentValue = function ()
    {
        var v = base.getCurrentValue.apply(this, []);
        if ((v + "").length > 0)
        {
            var x = parseInt(v);
            if (!isNaN(x))
                v = x;
        }
        return v;
    }
    this.setOriginalValue();

    this.renderEditableValue = function ($parent)
    {
        var $value = base.renderEditableValue.call(this, $parent);
        if (null == $value)
            return $value;
        var $input = $(".auto-select", $value);

        // Set the pattern to just allow integers.
        $input.attr("pattern", "[0-9]*");

        return $value
    }
}