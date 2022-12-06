function MultiLineTextPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    SingleLineTextPropertyValueRenderer.apply(this, arguments);
    var base = this.getBase();
    this.setOriginalValue();
}
