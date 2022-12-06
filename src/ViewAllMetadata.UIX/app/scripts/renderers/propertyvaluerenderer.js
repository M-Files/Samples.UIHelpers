function PropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    var renderer = this;
    var $listItem = null;
    var supportsEditing = false;
    this.getSupportsEditing = function () { return supportsEditing; }

    var events = new Events();
    this.addEventListener = events.addEventListener;
    this.dispatchEvent = events.dispatchEvent;

    this.getPropertyDef = function () { return propertyDef; }
    this.getListItem = function () { return $listItem; }
    this.getBase = function ()
    {
        var base = {}
        for (var p in this)
        {
            if (typeof this[p] == "function")
                base[p] = this[p];
        }
        return base;
    }

    this.getLocaleDateString = function(forPlugin)
    {
        const formats = {
            "af-ZA": "yyyy/MM/dd",
            "am-ET": "d/M/yyyy",
            "ar-AE": "dd/MM/yyyy",
            "ar-BH": "dd/MM/yyyy",
            "ar-DZ": "dd-MM-yyyy",
            "ar-EG": "dd/MM/yyyy",
            "ar-IQ": "dd/MM/yyyy",
            "ar-JO": "dd/MM/yyyy",
            "ar-KW": "dd/MM/yyyy",
            "ar-LB": "dd/MM/yyyy",
            "ar-LY": "dd/MM/yyyy",
            "ar-MA": "dd-MM-yyyy",
            "ar-OM": "dd/MM/yyyy",
            "ar-QA": "dd/MM/yyyy",
            "ar-SA": "dd/MM/yy",
            "ar-SY": "dd/MM/yyyy",
            "ar-TN": "dd-MM-yyyy",
            "ar-YE": "dd/MM/yyyy",
            "arn-CL": "dd-MM-yyyy",
            "as-IN": "dd-MM-yyyy",
            "az-Cyrl-AZ": "dd.MM.yyyy",
            "az-Latn-AZ": "dd.MM.yyyy",
            "ba-RU": "dd.MM.yy",
            "be-BY": "dd.MM.yyyy",
            "bg-BG": "dd.M.yyyy",
            "bn-BD": "dd-MM-yy",
            "bn-IN": "dd-MM-yy",
            "bo-CN": "yyyy/M/d",
            "br-FR": "dd/MM/yyyy",
            "bs-Cyrl-BA": "d.M.yyyy",
            "bs-Latn-BA": "d.M.yyyy",
            "ca-ES": "dd/MM/yyyy",
            "co-FR": "dd/MM/yyyy",
            "cs-CZ": "d.M.yyyy",
            "cy-GB": "dd/MM/yyyy",
            "da-DK": "dd-MM-yyyy",
            "de-AT": "dd.MM.yyyy",
            "de-CH": "dd.MM.yyyy",
            "de-DE": "dd.MM.yyyy",
            "de-LI": "dd.MM.yyyy",
            "de-LU": "dd.MM.yyyy",
            "dsb-DE": "d. M. yyyy",
            "dv-MV": "dd/MM/yy",
            "el-GR": "d/M/yyyy",
            "en-029": "MM/dd/yyyy",
            "en-AU": "d/MM/yyyy",
            "en-BZ": "dd/MM/yyyy",
            "en-CA": "dd/MM/yyyy",
            "en-GB": "dd/MM/yyyy",
            "en-IE": "dd/MM/yyyy",
            "en-IN": "dd-MM-yyyy",
            "en-JM": "dd/MM/yyyy",
            "en-MY": "d/M/yyyy",
            "en-NZ": "d/MM/yyyy",
            "en-PH": "M/d/yyyy",
            "en-SG": "d/M/yyyy",
            "en-TT": "dd/MM/yyyy",
            "en-US": "M/d/yyyy",
            "en-ZA": "yyyy/MM/dd",
            "en-ZW": "M/d/yyyy",
            "es-AR": "dd/MM/yyyy",
            "es-BO": "dd/MM/yyyy",
            "es-CL": "dd-MM-yyyy",
            "es-CO": "dd/MM/yyyy",
            "es-CR": "dd/MM/yyyy",
            "es-DO": "dd/MM/yyyy",
            "es-EC": "dd/MM/yyyy",
            "es-ES": "dd/MM/yyyy",
            "es-GT": "dd/MM/yyyy",
            "es-HN": "dd/MM/yyyy",
            "es-MX": "dd/MM/yyyy",
            "es-NI": "dd/MM/yyyy",
            "es-PA": "MM/dd/yyyy",
            "es-PE": "dd/MM/yyyy",
            "es-PR": "dd/MM/yyyy",
            "es-PY": "dd/MM/yyyy",
            "es-SV": "dd/MM/yyyy",
            "es-US": "M/d/yyyy",
            "es-UY": "dd/MM/yyyy",
            "es-VE": "dd/MM/yyyy",
            "et-EE": "d.MM.yyyy",
            "eu-ES": "yyyy/MM/dd",
            "fa-IR": "MM/dd/yyyy",
            "fi-FI": "d.M.yyyy",
            "fil-PH": "M/d/yyyy",
            "fo-FO": "dd-MM-yyyy",
            "fr-BE": "d/MM/yyyy",
            "fr-CA": "yyyy-MM-dd",
            "fr-CH": "dd.MM.yyyy",
            "fr-FR": "dd/MM/yyyy",
            "fr-LU": "dd/MM/yyyy",
            "fr-MC": "dd/MM/yyyy",
            "fy-NL": "d-M-yyyy",
            "ga-IE": "dd/MM/yyyy",
            "gd-GB": "dd/MM/yyyy",
            "gl-ES": "dd/MM/yy",
            "gsw-FR": "dd/MM/yyyy",
            "gu-IN": "dd-MM-yy",
            "ha-Latn-NG": "d/M/yyyy",
            "he-IL": "dd/MM/yyyy",
            "hi-IN": "dd-MM-yyyy",
            "hr-BA": "d.M.yyyy.",
            "hr-HR": "d.M.yyyy",
            "hsb-DE": "d. M. yyyy",
            "hu-HU": "yyyy. MM. dd.",
            "hy-AM": "dd.MM.yyyy",
            "id-ID": "dd/MM/yyyy",
            "ig-NG": "d/M/yyyy",
            "ii-CN": "yyyy/M/d",
            "is-IS": "d.M.yyyy",
            "it-CH": "dd.MM.yyyy",
            "it-IT": "dd/MM/yyyy",
            "iu-Cans-CA": "d/M/yyyy",
            "iu-Latn-CA": "d/MM/yyyy",
            "ja-JP": "yyyy/MM/dd",
            "ka-GE": "dd.MM.yyyy",
            "kk-KZ": "dd.MM.yyyy",
            "kl-GL": "dd-MM-yyyy",
            "km-KH": "yyyy-MM-dd",
            "kn-IN": "dd-MM-yy",
            "ko-KR": "yyyy. MM. dd",
            "kok-IN": "dd-MM-yyyy",
            "ky-KG": "dd.MM.yy",
            "lb-LU": "dd/MM/yyyy",
            "lo-LA": "dd/MM/yyyy",
            "lt-LT": "yyyy.MM.dd",
            "lv-LV": "yyyy.MM.dd.",
            "mi-NZ": "dd/MM/yyyy",
            "mk-MK": "dd.MM.yyyy",
            "ml-IN": "dd-MM-yy",
            "mn-MN": "yy.MM.dd",
            "mn-Mong-CN": "yyyy/M/d",
            "moh-CA": "M/d/yyyy",
            "mr-IN": "dd-MM-yyyy",
            "ms-BN": "dd/MM/yyyy",
            "ms-MY": "dd/MM/yyyy",
            "mt-MT": "dd/MM/yyyy",
            "nb-NO": "dd.MM.yyyy",
            "ne-NP": "M/d/yyyy",
            "nl-BE": "d/MM/yyyy",
            "nl-NL": "d-M-yyyy",
            "nn-NO": "dd.MM.yyyy",
            "nso-ZA": "yyyy/MM/dd",
            "oc-FR": "dd/MM/yyyy",
            "or-IN": "dd-MM-yy",
            "pa-IN": "dd-MM-yy",
            "pl-PL": "dd.MM.yyyy",
            "prs-AF": "dd/MM/yy",
            "ps-AF": "dd/MM/yy",
            "pt-BR": "d/M/yyyy",
            "pt-PT": "dd-MM-yyyy",
            "qut-GT": "dd/MM/yyyy",
            "quz-BO": "dd/MM/yyyy",
            "quz-EC": "dd/MM/yyyy",
            "quz-PE": "dd/MM/yyyy",
            "rm-CH": "dd/MM/yyyy",
            "ro-RO": "dd.MM.yyyy",
            "ru-RU": "dd.MM.yyyy",
            "rw-RW": "M/d/yyyy",
            "sa-IN": "dd-MM-yyyy",
            "sah-RU": "MM.dd.yyyy",
            "se-FI": "d.M.yyyy",
            "se-NO": "dd.MM.yyyy",
            "se-SE": "yyyy-MM-dd",
            "si-LK": "yyyy-MM-dd",
            "sk-SK": "d. M. yyyy",
            "sl-SI": "d.M.yyyy",
            "sma-NO": "dd.MM.yyyy",
            "sma-SE": "yyyy-MM-dd",
            "smj-NO": "dd.MM.yyyy",
            "smj-SE": "yyyy-MM-dd",
            "smn-FI": "d.M.yyyy",
            "sms-FI": "d.M.yyyy",
            "sq-AL": "yyyy-MM-dd",
            "sr-Cyrl-BA": "d.M.yyyy",
            "sr-Cyrl-CS": "d.M.yyyy",
            "sr-Cyrl-ME": "d.M.yyyy",
            "sr-Cyrl-RS": "d.M.yyyy",
            "sr-Latn-BA": "d.M.yyyy",
            "sr-Latn-CS": "d.M.yyyy",
            "sr-Latn-ME": "d.M.yyyy",
            "sr-Latn-RS": "d.M.yyyy",
            "sv-FI": "d.M.yyyy",
            "sv-SE": "yyyy-MM-dd",
            "sw-KE": "M/d/yyyy",
            "syr-SY": "dd/MM/yyyy",
            "ta-IN": "dd-MM-yyyy",
            "te-IN": "dd-MM-yy",
            "tg-Cyrl-TJ": "dd.MM.yy",
            "th-TH": "d/M/yyyy",
            "tk-TM": "dd.MM.yy",
            "tn-ZA": "yyyy/MM/dd",
            "tr-TR": "dd.MM.yyyy",
            "tt-RU": "dd.MM.yyyy",
            "tzm-Latn-DZ": "dd-MM-yyyy",
            "ug-CN": "yyyy-M-d",
            "uk-UA": "dd.MM.yyyy",
            "ur-PK": "dd/MM/yyyy",
            "uz-Cyrl-UZ": "dd.MM.yyyy",
            "uz-Latn-UZ": "dd/MM yyyy",
            "vi-VN": "dd/MM/yyyy",
            "wo-SN": "dd/MM/yyyy",
            "xh-ZA": "yyyy/MM/dd",
            "yo-NG": "d/M/yyyy",
            "zh-CN": "yyyy/M/d",
            "zh-HK": "d/M/yyyy",
            "zh-MO": "d/M/yyyy",
            "zh-SG": "d/M/yyyy",
            "zh-TW": "yyyy/M/d",
            "zu-ZA": "yyyy/MM/dd",
        };

        var l = navigator.language;
        try
        {
            l = (new Intl.DateTimeFormat().resolvedOptions()).locale;
        }
        catch (e) { }
        var format = formats[l] || "dd/MM/yyyy";
        return forPlugin
            ? format.replace("dd", "d")
                .replace("MM", "M")
                .replace("M", "m")
                .replace("yyyy", "Y")
            : format.toUpperCase();
    }

    this.getCurrentValue = function ()
    {
        return propertyValue.Value.DisplayValue;
    }
    var originalValue = this.getCurrentValue();
    this.setOriginalValue = function (v) { originalValue = v || this.getCurrentValue(); }
    this.getOriginalValue = function () { return originalValue; }
    this.getPropertyValue = function ()
    {
        if (false == supportsEditing)
            return propertyValue;

        var currentValue = this.getCurrentValue();

        var pv = new MFiles.PropertyValue();
        pv.PropertyDef = propertyDef.ID;
        if ((currentValue + "").length == 0)
        {
            pv.Value.SetValue(propertyDef.DataType, null);
        }
        else
        {
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

    this.hasChanged = function ()
    {
        return this.getCurrentValue() !== originalValue;
    }
    this.isValidValue = function()
    {
        var currentValue = this.getCurrentValue();

        return (isRequired && (currentValue + "").length > 0) || !isRequired;
    }

    this.renderLabel = function($parent)
    {
        // Create the label for the PV.
        var $label = $("<label></label>");
        if (isRequired)
            $label.addClass("mandatory");
        var $labelSpan = $("<span></span>");
        $labelSpan.text(propertyDef.Name);
        $label.append($labelSpan);

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($label);

        return $label;
    }
    this.renderReadOnlyValue = function($parent)
    {

        // Create the value for the PV.
        var $value = $("<span></span>").addClass("read-only-value");
        var value = this.getCurrentValue();
        if ((value + "").length == 0)
        {
            $listItem.addClass("empty");
            value = "---";
        }
        $value.text(value);

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }

    this.renderEditableValue = function($parent)
    {
        // Create the value for the PV.
        var $value = $("<span></span>").addClass("editing-value");

        // Create a standard input.
        var $input = $("<input type='text' maxlength='100' />").addClass("auto-select");
        $input.val(propertyValue.Value.DisplayValue);
        $input.blur(function ()
        {
            renderer.dispatchEvent(PropertyValueRenderer.EventTypes.PropertyValueChanged);
        });
        $value.append($input);

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }

    this.enterEditMode = function ()
    {
        // No editing?  Die.
        if (!dashboard.CustomData.configuration.EnableEditing)
            return;
        if (null == $listItem)
            return;

        // Hide options.
        $(".options-expanded").removeClass("options-expanded");

        // Already editing?
        if ($listItem.hasClass("editing"))
            return;

        // Start editing.
        $listItem.addClass("editing");
        $(".auto-select", $listItem).select();
    }
    this.exitEditMode = function ()
    {
        // No editing?  Die.
        if (!dashboard.CustomData.configuration.EnableEditing)
            return;

        // If it's invalid then mark the list item.
        if (!this.isValidValue())
        {
            if (null != $listItem)
                $listItem.addClass("invalid-value")
            return false;
        }

        // We're good.
        if (null != $listItem)
            $listItem.removeClass("invalid-value")

        // Set the value.
        var value = this.getCurrentValue();

        // Update the UI.
        if (null != $listItem)
            $listItem.removeClass("empty");
        if ((value + "").length == 0)
        {
            if (null != $listItem)
                $listItem.addClass("empty");
            value = "---";
        }
        $(".read-only-value", $listItem).text(value);

        if (null != $listItem)
            $listItem.removeClass("editing");
        return true;
    }

    this.render = function ()
    {
        // Create the (parent) list item.
        $listItem = $("<li></li>");
        $listItem.attr("tabindex", "0");
        $listItem.addClass("mfdatatype-" + propertyDef.DataType.toString()); // Add a class for the data type
        $listItem.data("propertyDef", propertyDef);
        $listItem.data("propertyValue", propertyValue);

        // Create the label.
        this.renderLabel($listItem);

        // Create the read-only value.
        this.renderReadOnlyValue($listItem);

        // Is editing enabled?
        if (dashboard.CustomData.configuration.EnableEditing)
        {

            // Is the property editable?
            if (propertyDef.AutomaticValueType == MFAutomaticValueTypeNone)
            {

                // Attempt to create the editable value.
                var $editableValue = this.renderEditableValue($listItem);
                if (null != $editableValue)
                {
                    // Mark it as editable.
                    supportsEditing = true;
                    $listItem.addClass("editable");

                    // Add the handler to allow editing.
                    $listItem.click(function (e)
                    {
                        renderer.enterEditMode();
                        e.stopPropagation();
                        return false;
                    });
                    $listItem.focus(function (e)
                    {
                        renderer.enterEditMode();
                        e.stopPropagation();
                        return false;
                    });
                }
            }

        }

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($listItem);


        return $listItem;
    }

    return this;
}
PropertyValueRenderer.EventTypes = {
    PropertyValueChanged: 1
};
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