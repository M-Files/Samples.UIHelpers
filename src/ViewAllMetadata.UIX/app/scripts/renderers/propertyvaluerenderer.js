function getLocaleDateString()
{
    const formats = {
        "af-ZA": "Y/m/d",
        "am-ET": "d/M/Y",
        "ar-AE": "d/m/Y",
        "ar-BH": "d/m/Y",
        "ar-DZ": "d-m-Y",
        "ar-EG": "d/m/Y",
        "ar-IQ": "d/m/Y",
        "ar-JO": "d/m/Y",
        "ar-KW": "d/m/Y",
        "ar-LB": "d/m/Y",
        "ar-LY": "d/m/Y",
        "ar-MA": "d-m-Y",
        "ar-OM": "d/m/Y",
        "ar-QA": "d/m/Y",
        "ar-SA": "d/m/yy",
        "ar-SY": "d/m/Y",
        "ar-TN": "d-m-Y",
        "ar-YE": "d/m/Y",
        "arn-CL": "d-m-Y",
        "as-IN": "d-m-Y",
        "az-Cyrl-AZ": "d.m.Y",
        "az-Latn-AZ": "d.m.Y",
        "ba-RU": "d.m.yy",
        "be-BY": "d.m.Y",
        "bg-BG": "d.M.Y",
        "bn-BD": "d-m-yy",
        "bn-IN": "d-m-yy",
        "bo-CN": "Y/M/d",
        "br-FR": "d/m/Y",
        "bs-Cyrl-BA": "d.M.Y",
        "bs-Latn-BA": "d.M.Y",
        "ca-ES": "d/m/Y",
        "co-FR": "d/m/Y",
        "cs-CZ": "d.M.Y",
        "cy-GB": "d/m/Y",
        "da-DK": "d-m-Y",
        "de-AT": "d.m.Y",
        "de-CH": "d.m.Y",
        "de-DE": "d.m.Y",
        "de-LI": "d.m.Y",
        "de-LU": "d.m.Y",
        "dsb-DE": "d. M. Y",
        "dv-MV": "d/m/yy",
        "el-GR": "d/M/Y",
        "en-029": "m/d/Y",
        "en-AU": "d/m/Y",
        "en-BZ": "d/m/Y",
        "en-CA": "d/m/Y",
        "en-GB": "d/m/Y",
        "en-IE": "d/m/Y",
        "en-IN": "d-m-Y",
        "en-JM": "d/m/Y",
        "en-MY": "d/M/Y",
        "en-NZ": "d/m/Y",
        "en-PH": "M/d/Y",
        "en-SG": "d/M/Y",
        "en-TT": "d/m/Y",
        "en-US": "M/d/Y",
        "en-ZA": "Y/m/d",
        "en-ZW": "M/d/Y",
        "es-AR": "d/m/Y",
        "es-BO": "d/m/Y",
        "es-CL": "d-m-Y",
        "es-CO": "d/m/Y",
        "es-CR": "d/m/Y",
        "es-DO": "d/m/Y",
        "es-EC": "d/m/Y",
        "es-ES": "d/m/Y",
        "es-GT": "d/m/Y",
        "es-HN": "d/m/Y",
        "es-MX": "d/m/Y",
        "es-NI": "d/m/Y",
        "es-PA": "m/d/Y",
        "es-PE": "d/m/Y",
        "es-PR": "d/m/Y",
        "es-PY": "d/m/Y",
        "es-SV": "d/m/Y",
        "es-US": "M/d/Y",
        "es-UY": "d/m/Y",
        "es-VE": "d/m/Y",
        "et-EE": "d.m.Y",
        "eu-ES": "Y/m/d",
        "fa-IR": "m/d/Y",
        "fi-FI": "d.M.Y",
        "fil-PH": "M/d/Y",
        "fo-FO": "d-m-Y",
        "fr-BE": "d/m/Y",
        "fr-CA": "Y-m-d",
        "fr-CH": "d.m.Y",
        "fr-FR": "d/m/Y",
        "fr-LU": "d/m/Y",
        "fr-MC": "d/m/Y",
        "fy-NL": "d-M-Y",
        "ga-IE": "d/m/Y",
        "gd-GB": "d/m/Y",
        "gl-ES": "d/m/yy",
        "gsw-FR": "d/m/Y",
        "gu-IN": "d-m-yy",
        "ha-Latn-NG": "d/M/Y",
        "he-IL": "d/m/Y",
        "hi-IN": "d-m-Y",
        "hr-BA": "d.M.Y.",
        "hr-HR": "d.M.Y",
        "hsb-DE": "d. M. Y",
        "hu-HU": "Y. m. d.",
        "hy-AM": "d.m.Y",
        "id-ID": "d/m/Y",
        "ig-NG": "d/M/Y",
        "ii-CN": "Y/M/d",
        "is-IS": "d.M.Y",
        "it-CH": "d.m.Y",
        "it-IT": "d/m/Y",
        "iu-Cans-CA": "d/M/Y",
        "iu-Latn-CA": "d/m/Y",
        "ja-JP": "Y/m/d",
        "ka-GE": "d.m.Y",
        "kk-KZ": "d.m.Y",
        "kl-GL": "d-m-Y",
        "km-KH": "Y-m-d",
        "kn-IN": "d-m-yy",
        "ko-KR": "Y. m. d",
        "kok-IN": "d-m-Y",
        "ky-KG": "d.m.yy",
        "lb-LU": "d/m/Y",
        "lo-LA": "d/m/Y",
        "lt-LT": "Y.m.d",
        "lv-LV": "Y.m.d.",
        "mi-NZ": "d/m/Y",
        "mk-MK": "d.m.Y",
        "ml-IN": "d-m-yy",
        "mn-MN": "yy.m.d",
        "mn-Mong-CN": "Y/M/d",
        "moh-CA": "M/d/Y",
        "mr-IN": "d-m-Y",
        "ms-BN": "d/m/Y",
        "ms-MY": "d/m/Y",
        "mt-MT": "d/m/Y",
        "nb-NO": "d.m.Y",
        "ne-NP": "M/d/Y",
        "nl-BE": "d/m/Y",
        "nl-NL": "d-M-Y",
        "nn-NO": "d.m.Y",
        "nso-ZA": "Y/m/d",
        "oc-FR": "d/m/Y",
        "or-IN": "d-m-yy",
        "pa-IN": "d-m-yy",
        "pl-PL": "d.m.Y",
        "prs-AF": "d/m/yy",
        "ps-AF": "d/m/yy",
        "pt-BR": "d/M/Y",
        "pt-PT": "d-m-Y",
        "qut-GT": "d/m/Y",
        "quz-BO": "d/m/Y",
        "quz-EC": "d/m/Y",
        "quz-PE": "d/m/Y",
        "rm-CH": "d/m/Y",
        "ro-RO": "d.m.Y",
        "ru-RU": "d.m.Y",
        "rw-RW": "M/d/Y",
        "sa-IN": "d-m-Y",
        "sah-RU": "m.d.Y",
        "se-FI": "d.M.Y",
        "se-NO": "d.m.Y",
        "se-SE": "Y-m-d",
        "si-LK": "Y-m-d",
        "sk-SK": "d. M. Y",
        "sl-SI": "d.M.Y",
        "sma-NO": "d.m.Y",
        "sma-SE": "Y-m-d",
        "smj-NO": "d.m.Y",
        "smj-SE": "Y-m-d",
        "smn-FI": "d.M.Y",
        "sms-FI": "d.M.Y",
        "sq-AL": "Y-m-d",
        "sr-Cyrl-BA": "d.M.Y",
        "sr-Cyrl-CS": "d.M.Y",
        "sr-Cyrl-ME": "d.M.Y",
        "sr-Cyrl-RS": "d.M.Y",
        "sr-Latn-BA": "d.M.Y",
        "sr-Latn-CS": "d.M.Y",
        "sr-Latn-ME": "d.M.Y",
        "sr-Latn-RS": "d.M.Y",
        "sv-FI": "d.M.Y",
        "sv-SE": "Y-m-d",
        "sw-KE": "M/d/Y",
        "syr-SY": "d/m/Y",
        "ta-IN": "d-m-Y",
        "te-IN": "d-m-yy",
        "tg-Cyrl-TJ": "d.m.yy",
        "th-TH": "d/M/Y",
        "tk-TM": "d.m.yy",
        "tn-ZA": "Y/m/d",
        "tr-TR": "d.m.Y",
        "tt-RU": "d.m.Y",
        "tzm-Latn-DZ": "d-m-Y",
        "ug-CN": "Y-M-d",
        "uk-UA": "d.m.Y",
        "ur-PK": "d/m/Y",
        "uz-Cyrl-UZ": "d.m.Y",
        "uz-Latn-UZ": "d/m Y",
        "vi-VN": "d/m/Y",
        "wo-SN": "d/m/Y",
        "xh-ZA": "Y/m/d",
        "yo-NG": "d/M/Y",
        "zh-CN": "Y/M/d",
        "zh-HK": "d/M/Y",
        "zh-MO": "d/M/Y",
        "zh-SG": "d/M/Y",
        "zh-TW": "Y/M/d",
        "zu-ZA": "Y/m/d",
    };

    var l = navigator.language;
    try
    {
        l = (new Intl.DateTimeFormat().resolvedOptions()).locale;
    }
    catch (e) { }
    return formats[l] || "dd/MM/yyyy";
}
function PropertyValueRenderer(dashboard, propertyDef, propertyValue, isRequired, $parent)
{
    var renderer = this;
    var $listItem = null;
    var supportsEditing = false;
    var originalValue = getCurrentValue();
    renderer.getPropertyDef = function () { return propertyDef; }
    function getCurrentValue()
    {
        switch (propertyDef.DataType)
        {
            case MFDatatypeDate:
                return false == supportsEditing
                    ? propertyValue.Value.DisplayValue
                    : $(".auto-select", $listItem).val();
            case MFDatatypeBoolean:
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
            case MFDatatypeText:
            case MFDatatypeMultiLineText:
                return false == supportsEditing
                    ? propertyValue.Value.DisplayValue
                    : $(".auto-select", $listItem).val() + "";
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                var v = false == supportsEditing
                    ? propertyValue.Value.DisplayValue
                    : $(".auto-select", $listItem).val() + "";
                if ((v + "").length > 0)
                {
                    var x = parseFloat(v);
                    if (!isNaN(x))
                        v = x;
                }
                return v;
            default:
                return propertyValue.Value.DisplayValue;
        }
    }
    renderer.getPropertyValue = function ()
    {
        if (false == supportsEditing)
            return propertyValue;
        switch (propertyDef.DataType)
        {
            case MFDatatypeDate:
            case MFDatatypeBoolean:
                var currentValue = getCurrentValue();
                var pv = new MFiles.PropertyValue();
                pv.PropertyDef = propertyDef.ID;
                if ((currentValue + "").length == 0)
                {
                    pv.Value.SetValue(propertyDef.DataType, null);
                }
                else
                {
                    pv.Value.SetValue(propertyDef.DataType, currentValue);
                }
                return pv;
            case MFDatatypeText:
            case MFDatatypeMultiLineText:
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                var pv = new MFiles.PropertyValue();
                pv.PropertyDef = propertyDef.ID;
                pv.Value.SetValue(propertyDef.DataType, getCurrentValue());
                return pv;
            default:
                return propertyValue;
        }
    }
    renderer.hasChanged = function ()
    {
        var currentValue = getCurrentValue();
        switch (propertyDef.DataType)
        {
            case MFDatatypeDate:
            case MFDatatypeBoolean:
            case MFDatatypeText:
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                return currentValue !== originalValue;
            case MFDatatypeMultiLineText:
                // Line ending fun.
                return (currentValue + "").replace(/\r\n/g, "\n") !== (originalValue + "").replace(/\r\n/g, "\n");
            default:
                return false;
        }
    }
    renderer.isValidValue = function()
    {
        var currentValue = getCurrentValue();

        switch (propertyDef.DataType)
        {
            case MFDatatypeBoolean:
                switch ((currentValue + "").toLowerCase())
                {
                    case "true":
                    case "false":
                    case "":
                        return true;
                    default:
                        return !isRequired;
                }
            case MFDatatypeText:
            case MFDatatypeMultiLineText:
                // If it does not have a value but is required, die.
                if ((currentValue + "").length == 0 && isRequired)
                    return false;
                break;
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                // If it's empty then just check whether it's required.
                if ((currentValue + "").length == 0)
                    return !isRequired;

                // If it's got a value, but not a number, die.
                currentValue = parseFloat(currentValue);
                if (isNaN(currentValue))
                    return false;

                break;
            default:
                return true;
        }
        return true;
    }

    function renderLabel($parent)
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
    function renderReadOnlyValue($parent)
    {

        // Create the value for the PV.
        var $value = $("<span></span>").addClass("read-only-value");
        var value = propertyValue.Value.DisplayValue;
        if ((value + "").length == 0)
        {
            $listItem.addClass("empty");
            value = "---";
        }
        $value.text(value);

        // Do any special processing for different data types.
        switch (propertyDef.DataType)
        {
            case MFDatatypeMultiSelectLookup:
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
                break;
        }

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }
    function renderEditableValue($parent)
    {

        // Create the value for the PV.
        var $value = $("<span></span>").addClass("editing-value");

        // Render each data type.
        switch (propertyDef.DataType)
        {
            case MFDatatypeBoolean:
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
                $select.change(function () { renderer.exitEditMode(); });
                $value.append($select);
                break;
            case MFDatatypeMultiLineText:
                var $textarea = $("<textarea></textarea>").addClass("auto-select");
                $textarea.val(propertyValue.Value.DisplayValue);
                $textarea.blur(function () { renderer.exitEditMode(); });
                $value.append($textarea);
                break;
            case MFDatatypeText:
            case MFDatatypeInteger:
            case MFDatatypeFloating:
            case MFDatatypeDate:
                var $input = $("<input type='text' maxlength='100' />").addClass("auto-select");
                $input.val(propertyValue.Value.DisplayValue);
                //$input.blur(function () { renderer.exitEditMode(); });
                $value.append($input);

                // If it's a number then set the input mode.
                // Note: this doesn't do anything currently, but maybe in the future...
                if (propertyDef.DataType == MFDatatypeInteger
                    || propertyDef.DataType == MFDatatypeFloating)
                {
                    $input.val(propertyValue.Value.DisplayValue);
                    $input.attr("inputmode", "numeric");
                    var pattern = "[0-9]*"; // Default to allowing just numbers.
                    if (propertyDef.DataType == MFDatatypeFloating)
                    {
                        pattern = "[0-9\.\,]*"; // Allow decimal separators too.
                    }
                    $input.attr("pattern", pattern);
                }

                // If it's a date then set up the picker.
                if (propertyDef.DataType == MFDatatypeDate)
                {
                    var format = getLocaleDateString();
                    $input.datetimepicker
                        (
                            {
                                timepicker: false,
                                value: propertyValue.Value.DisplayValue,
                                format: format
                            }
                        );
                }

                break;
            default:
                return null;
        }

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }

    renderer.enterEditMode = function ()
    {
        // No editing?  Die.
        if (!dashboard.CustomData.configuration.EnableEditing)
            return;
        if (null == $listItem)
            return;
        // Already editing?
        if ($listItem.hasClass("editing"))
            return;

        // Start editing.
        $listItem.addClass("editing");
        $(".auto-select", $listItem).select();
    }
    renderer.exitEditMode = function ()
    {
        // No editing?  Die.
        if (!dashboard.CustomData.configuration.EnableEditing)
            return;
        switch (propertyDef.DataType)
        {
            case MFDatatypeDate:
            case MFDatatypeBoolean:
            case MFDatatypeText:
            case MFDatatypeMultiLineText:
            case MFDatatypeInteger:
            case MFDatatypeFloating:
                // If it's invalid then mark the list item.
                if (!renderer.isValidValue())
                {
                    if (null != $listItem)
                        $listItem.addClass("invalid-value")
                    return false;
                }

                // We're good.
                if (null != $listItem)
                    $listItem.removeClass("invalid-value")

                // Set the value.
                var value = getCurrentValue();

                // Format the value.
                switch (propertyDef.DataType)
                {
                    case MFDatatypeBoolean:
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
                        break;
                }

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
                break;
        }
        if (null != $listItem)
            $listItem.removeClass("editing");
        return true;
    }

    renderer.render = function ()
    {
        // Create the (parent) list item.
        $listItem = $("<li></li>");
        $listItem.attr("tabindex", "0");
        $listItem.addClass("mfdatatype-" + propertyDef.DataType.toString()); // Add a class for the data type
        $listItem.data("propertyDef", propertyDef);
        $listItem.data("propertyValue", propertyValue);

        // Create the label.
        renderLabel($listItem);

        // Create the read-only value.
        renderReadOnlyValue($listItem);

        // Is editing enabled?
        if (dashboard.CustomData.configuration.EnableEditing)
        {

            // Is the property editable?
            if (propertyDef.AutomaticValueType == MFAutomaticValueTypeNone)
            {

                // Attempt to create the editable value.
                var $editableValue = renderEditableValue($listItem);
                if (null != $editableValue)
                {
                    // Mark it as editable.
                    supportsEditing = true;
                    $listItem.addClass("editable");

                    // Add the handler to allow editing.
                    $listItem.click(function (e)
                    {
                        $(".editing").removeClass("editing");
                        renderer.enterEditMode();
                        e.stopPropagation();
                        return false;
                    });
                    $listItem.focus(function (e)
                    {
                        $(".editing").removeClass("editing");
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

    return renderer;
}