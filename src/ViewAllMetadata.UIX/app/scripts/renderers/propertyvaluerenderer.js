function PropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    var renderer = this;
    var $listItem = null;
    var supportsEditing = false;
    renderer.getPropertyDef = function () { return propertyDef; }

    renderer.getLocaleDateString = function(forPlugin)
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

    renderer.getCurrentValue = function()
    {
        switch (propertyDef.DataType)
        {
            case MFDatatypeLookup:
                if (false == supportsEditing)
                {
                    if ((propertyValue.Value.IsNULL() ? "" : propertyValue.Value.GetLookupID()))
                        return "";
                    return {
                        id: propertyValue.Value.GetLookupID(),
                        displayValue: propertyValue.Value.DisplayValue
                    };
                }
                var v = $(".text-entry", $listItem).data("id");
                if (isNaN(v) || v == 0)
                    return "";
                return {
                        id: v,
                        displayValue: $(".text-entry", $listItem).data("displayValue")
                    };
                return v;
            case MFDatatypeTimestamp:
            case MFDatatypeDate:
                return false == supportsEditing
                    ? propertyValue.Value.DisplayValue
                    : $(".auto-select", $listItem).val();
            case MFDatatypeTime:
                var v = false == supportsEditing
                    ? propertyValue.Value.DisplayValue
                    : $(".auto-select", $listItem).val();
                if (v == "__:__:__") // Happens when tabbing through the time field; just get the mask.
                    v = "";
                return v;
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
    var originalValue = renderer.getCurrentValue();
    renderer.getPropertyValue = function ()
    {
        if (false == supportsEditing)
            return propertyValue;

        var currentValue = renderer.getCurrentValue();
        switch (propertyDef.DataType)
        {
            case MFDatatypeLookup:
                if (currentValue != "")
                {
                    currentValue = currentValue.id;
                }
                break;
            case MFDatatypeDate:
                if ((currentValue + "").length > 0)
                {
                    currentValue = dayjs(currentValue, renderer.getLocaleDateString(false)).utc().format("YYYY-MM-DD")
                }
                break;
            case MFDatatypeTimestamp:
                if ((currentValue + "").length > 0)
                {
                    currentValue = dayjs(currentValue, renderer.getLocaleDateString(false) + " HH:mm").utc().format("YYYY-MM-DD HH:mm:ss")
                }
                break;
        }
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
    renderer.hasChanged = function ()
    {
        var currentValue = renderer.getCurrentValue();
        switch (propertyDef.DataType)
        {
            case MFDatatypeLookup:
                if (typeof currentValue != typeof originalValue)
                    return true;
                if (currentValue == "" && originalValue == "")
                    return true;
                return (currentValue.id != originalValue.id);
            case MFDatatypeTimestamp:
            case MFDatatypeTime:
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
        var currentValue = renderer.getCurrentValue();

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
            case MFDatatypeLookup:
                if (currentValue == "")
                    return !isRequired;
                return currentValue.id > 0;
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
                return (isRequired && (currentValue + "").length > 0) || !isRequired;
        }
        return true;
    }

    renderer.renderLabel = function($parent)
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
    renderer.renderReadOnlyValue = function($parent)
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
    renderer.renderEditableValue = function($parent)
    {

        // Create the value for the PV.
        var $value = $("<span></span>").addClass("editing-value");

        // Render each data type.
        switch (propertyDef.DataType)
        {
            case MFDatatypeLookup:
                var $textInput = $("<input type='text' maxlength='100' />")
                    .addClass("text-entry");
                var $select = $("<div></div>").addClass("select")
                    .append($("<ol></ol>"));

                function sortItems(obj)
                {
                    // Convert to a JS array.
                    var arr = [];
                    for (var i = 0; i < obj.Count; i++) {
                        arr.push(obj[i]);
                    }
                    arr.sort(function (a, b)
                    {
                        return a.Name == b.Name ? 0
                            : (a.Name < b.Name)
                                ? propertyDef.SortAscending ? -1 : 1
                                : propertyDef.SortAscending ? 1 : -1;
                    });
                    return arr;
                }

                function populateLookupOptions()
                {
                    // Is this class?
                    if (propertyDef.ID == 100)
                    {
                        // Get the object type
                        var objectType = objectRenderer.getObjectBeingRendered().VersionData.ObjVer.Type;

                        // Search.
                        dashboard.Vault.Async.ClassOperations.GetObjectClasses
                            (
                                objectType,
                                function (results)
                                {
                                    // Empty the select.
                                    var $ol = $("ol", $select);
                                    $ol.empty();

                                    // Add an item for each one.
                                    var arr = sortItems(results);
                                    for (var i = 0; i < arr.length; i++)
                                    {
                                        var item = arr[i];
                                        var $li = $("<li></li>")
                                            .text(item.Name)
                                            .data("id", item.ID)
                                            .data("displayValue", item.Name);
                                        $li.click(function ()
                                        {
                                            var $this = $(this);
                                            var id = $this.data("id");
                                            var displayValue = $this.data("displayValue");
                                            $textInput.val(displayValue);
                                            $textInput.data("displayValue", displayValue);
                                            $textInput.data("id", id);
                                            $listItem.removeClass("options-expanded");
                                        });
                                        $ol.append($li);
                                    }
                                },
                                function (shorterror, longerror, errorobj)
                                {
                                    // Error checking permissions.
                                    MFiles.ReportException(errorobj);
                                }
                            );

                        return;
                    }

                    // It's another property.

                    // Build up the search conditions.
                    var searchConditions = new MFiles.SearchConditions();

                    // Search.
                    dashboard.Vault.Async.ValueListItemOperations.SearchForValueListItemsEx2
                        (
                            propertyDef.ValueList,
                            searchConditions,
                            false,
                            MFExternalDBRefreshTypeNone,
                            true,
                            propertyDef.ID,
                            50,
                            function (results)
                            {
                                // Empty the select.
                                var $ol = $("ol", $select);
                                $ol.empty();

                                // Are there more?
                                if (results.MoreResults)
                                {
                                    $ol.append("<li class='caption'>First 50 values</li>");
                                }

                                // Add an item for each one.
                                var arr = sortItems(results);
                                for (var i = 0; i < arr.length; i++)
                                {
                                    var item = arr[i];
                                    var $li = $("<li></li>")
                                        .text(item.Name)
                                        .data("id", item.ID)
                                        .data("displayValue", item.Name);
                                    $li.click(function ()
                                    {
                                        var $this = $(this);
                                        var id = $this.data("id");
                                        var displayValue = $this.data("displayValue");
                                        $textInput.val(displayValue);
                                        $textInput.data("displayValue", displayValue);
                                        $textInput.data("id", id);
                                        $listItem.removeClass("options-expanded");
                                    });
                                    $ol.append($li);
                                }
                            },
                            function (shorterror, longerror, errorobj)
                            {
                                // Error checking permissions.
                                MFiles.ReportException(errorobj);
                            }
                        );
                }
                $textInput.change(populateLookupOptions);

                var $dropdown = $("<a />")
                    .addClass("dropdown")
                    .click(function ()
                {
                    // Toggle options.
                        $listItem.addClass("options-expanded");
                        populateLookupOptions();
                    return false;
                });

                $value.append($textInput);
                $value.append($select);
                $value.append($dropdown);
                if (!propertyValue.Value.IsNull())
                {
                    $textInput.val(propertyValue.Value.DisplayValue);
                    $textInput.data("id", propertyValue.Value.GetLookupID());
                    $textInput.data("displayValue", propertyValue.Value.DisplayValue);
                }
                break;
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
                //$select.change(function () { renderer.exitEditMode(); });
                $value.append($select);
                break;
            case MFDatatypeMultiLineText:
                var $textarea = $("<textarea></textarea>").addClass("auto-select");
                $textarea.val(propertyValue.Value.DisplayValue);
                //$textarea.blur(function () { renderer.exitEditMode(); });
                $value.append($textarea);
                break;
            case MFDatatypeTimestamp:
            case MFDatatypeTime:
            case MFDatatypeDate:
            case MFDatatypeText:
            case MFDatatypeInteger:
            case MFDatatypeFloating:
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
                    var format = renderer.getLocaleDateString(true);
                    $input.datetimepicker
                        (
                            {
                                timepicker: false,
                                value: propertyValue.Value.DisplayValue,
                                format: format,
                                mask: true
                            }
                        );
                }

                // If it's time then set up the picker.
                if (propertyDef.DataType == MFDatatypeTime)
                {
                    $input.datetimepicker
                        (
                            {
                                datepicker: false,
                                timepicker: true,
                                value: propertyValue.Value.DisplayValue,
                                mask: true,
                                format: 'H:i',
                                step: 1
                            }
                        );
                }

                // If it's time then set up the picker.
                if (propertyDef.DataType == MFDatatypeTimestamp)
                {
                    var format = renderer.getLocaleDateString(true) + " H:i";
                    $input.datetimepicker
                        (
                            {
                                datepicker: true,
                                timepicker: true,
                                value: propertyValue.Value.DisplayValue,
                                mask: true,
                                format: format,
                                step: 1
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

        // Hide options.
        $(".options-expanded").removeClass("options-expanded");

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
            case MFDatatypeLookup:
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
                var value = renderer.getCurrentValue();

                // Update the UI.
                if (null != $listItem)
                    $listItem.removeClass("empty");
                if ((value + "").length == 0)
                {
                    if (null != $listItem)
                        $listItem.addClass("empty");
                    value = "---";
                }
                $(".read-only-value", $listItem).text(value.displayValue);
                break;
            case MFDatatypeTimestamp:
            case MFDatatypeTime:
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
                var value = renderer.getCurrentValue();

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
        renderer.renderLabel($listItem);

        // Create the read-only value.
        renderer.renderReadOnlyValue($listItem);

        // Is editing enabled?
        if (dashboard.CustomData.configuration.EnableEditing)
        {

            // Is the property editable?
            if (propertyDef.AutomaticValueType == MFAutomaticValueTypeNone)
            {

                // Attempt to create the editable value.
                var $editableValue = renderer.renderEditableValue($listItem);
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

    return renderer;
}