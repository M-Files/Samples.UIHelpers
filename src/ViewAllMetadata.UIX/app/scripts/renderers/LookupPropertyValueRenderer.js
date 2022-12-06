
function LookupPropertyValueRenderer(dashboard, objectRenderer, propertyDef, propertyValue, isRequired, $parent)
{
    // Set up the base object.
    var renderer = this;
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
            if (propertyValue.Value.IsNULL() || propertyDef.DataType != MFDatatypeLookup)
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
    this.hasChanged = function ()
    {
        var currentValue = this.getCurrentValue();
        var originalValue = this.getOriginalValue();

        if (typeof currentValue != typeof originalValue)
            return true;
        if (currentValue == "" && originalValue == "")
            return false;
        return (currentValue.id != originalValue.id);
    }

    this.sortItems = function (obj)
    {
        // Convert to a JS array.
        var arr = [];
        for (var i = 0; i < obj.Count; i++)
        {
            arr.push(obj[i]);
        }
        arr.sort(function (a, b)
        {
            var x = a.Name == b.Name ? 0
                : a.Name.localeCompare(b.Name);
            if (!propertyDef.SortAscending)
                x = x * -1;
            return x;
        });
        return arr;
    }
    this.renderOptions = function ($listItem, $textInput, $select, restrictByEnteredText)
    {
        $listItem.addClass("options-expanded");

        // Is this class?
        if (propertyDef.ID == 100)
        {
            // Class is special.
            renderer.renderClassOptions($listItem, $textInput, $select, restrictByEnteredText);
        }
        else
        {
            renderer.renderLookupOptions($listItem, $textInput, $select, restrictByEnteredText);
        }
    }
    this.renderClassOptions = function ($listItem, $textInput, $select, restrictByEnteredText)
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

                    // What's typed in?
                    var val = ($textInput.val() + "").toLowerCase();

                    // What's the current value?
                    var currentValue = renderer.getCurrentValue();

                    // Add an item for each one.
                    var arr = renderer.sortItems(results);
                    for (var i = 0; i < arr.length; i++)
                    {
                        var item = arr[i];

                        // We can't filter classes by name, so let's filter now.
                        if (restrictByEnteredText && val.length > 0)
                            if (item.Name.toLowerCase().indexOf(val) == -1)
                                continue;

                        var $li = $("<li></li>")
                            .text(item.Name)
                            .data("id", item.ID)
                            .data("displayValue", item.Name);

                        // Mark the option as selected if it's the current one.
                        if (typeof currentValue == "object" && currentValue.id == item.ID)
                            $li.addClass("current");

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
    this.renderLookupOptions = function ($listItem, $textInput, $select, restrictByEnteredText)
    {
        // Build up the search conditions.
        var searchConditions = new MFiles.SearchConditions();

        // Add condition to search by name.
        if (restrictByEnteredText && ($textInput.val() + "").length > 0)
        {
            var nameCondition = new MFiles.SearchCondition();
            nameCondition.Expression.SetValueListItemExpression(2, 0, new MFiles.DataFunctionCall());
            nameCondition.ConditionType = MFConditionTypeStartsWith;
            nameCondition.TypedValue.SetValue(MFDatatypeText, $textInput.val());
            searchConditions.Add(-1, nameCondition);
        }

        // Filter out deleted items.
        var deletedItemsCondition = new MFiles.SearchCondition();
        deletedItemsCondition.Expression.SetValueListItemExpression(5, 0, new MFiles.DataFunctionCall());
        deletedItemsCondition.ConditionType = MFConditionTypeEqual;
        deletedItemsCondition.TypedValue.SetValue(MFDatatypeBoolean, false);
        searchConditions.Add(-1, deletedItemsCondition);

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

                    // What's the current value?
                    var currentValue = renderer.getCurrentValue();

                    // Add an item for each one.
                    var arr = renderer.sortItems(results);
                    for (var i = 0; i < arr.length; i++)
                    {
                        var item = arr[i];
                        var $li = $("<li></li>")
                            .text(item.Name)
                            .data("id", item.ID)
                            .data("displayValue", item.Name);

                        // Mark the option as selected if it's the current one.
                        if (typeof currentValue == "object" && currentValue.id == item.ID)
                            $li.addClass("current");

                        $li.click(function ()
                        {
                            var $this = $(this);
                            var id = $this.data("id");
                            var displayValue = $this.data("displayValue");
                            $textInput.val(displayValue);
                            $textInput.data("displayValue", displayValue);
                            $textInput.data("id", id);
                            $listItem.removeClass("options-expanded");
                            renderer.dispatchEvent(PropertyValueRenderer.EventTypes.PropertyValueChanged)
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
    this.renderSingleLookupOption = function ($listItem, $value, selectedItemId, selectedItemDisplayValue)
    {
        var $textInput = $("<input type='text' maxlength='100' />")
            .addClass("text-entry");
        var $select = $("<div></div>").addClass("select")
            .append($("<ol></ol>"));
        $textInput.click(function () { renderer.renderOptions($listItem, $textInput, $select, true); });
        $textInput.keyup(function () { renderer.renderOptions($listItem, $textInput, $select, true); });
        $textInput.focus(function () { renderer.renderOptions($listItem, $textInput, $select, true); });

        var $dropdown = $("<a />")
            .addClass("dropdown")
            .click(function ()
            {
                // Toggle options.
                $listItem.addClass("options-expanded");
                renderer.renderOptions($listItem, $textInput, $select, false);
                return false;
            });

        $value.append($textInput);
        $value.append($select);
        $value.append($dropdown);
        if (selectedItemId != null)
        {
            $textInput.val(selectedItemDisplayValue);
            $textInput.data("id", selectedItemId);
            $textInput.data("displayValue", selectedItemDisplayValue);
        }

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value
    }

    this.renderEditableValue = function ($parent)
    {
        var supportsEditing = this.getSupportsEditing();
        var $listItem = this.getListItem();

        // Create the value for the PV.
        var $value = $("<span></span>").addClass("editing-value");

        // Render the single item.
        renderer.renderSingleLookupOption
            (
                $listItem,
                $value,
                !propertyValue.Value.IsNull() ? propertyValue.Value.GetLookupID() : null,
                !propertyValue.Value.IsNull() ? propertyValue.Value.DisplayValue : null
            );

        // Add to a parent if we can.
        if (null != $parent)
            $parent.append($value);

        return $value

    }
}