
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
        if (isNaN(v))
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
        // ID should be > 0, UNLESS it's the class,
        // in which case the built -in "document" class has an ID of zero and is valid.
        return currentValue.id > 0 || (propertyDef.ID == 100 && currentValue.id == 0);
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
    this.renderOptions = function ($div, $textInput, $select, restrictByEnteredText)
    {
        $div.addClass("options-expanded");

        // Is this class?
        if (propertyDef.ID == 100)
        {
            // Class is special.
            renderer.renderClassOptions($div, $textInput, $select, restrictByEnteredText);
        }
        else
        {
            renderer.renderLookupOptions($div, $textInput, $select, restrictByEnteredText);
        }
    }
    this.renderClassOptions = function ($div, $textInput, $select, restrictByEnteredText)
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
                            $div.removeClass("options-expanded");
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
    this.renderLookupOptions = function ($div, $textInput, $select, restrictByEnteredText)
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

        var filterString = "";

        // Does the property definition need filtering?
        if (propertyDef.DependencyRelation == 2 && propertyDef.DependencyPD > 0)
        {
            // Get the values for the dependency condition.
            var dependencyPropertyValue = objectRenderer.getPropertyValue(propertyDef.DependencyPD);
            var propertyDefValueList = dashboard.CustomData.vaultStructureManager.getValueList(propertyDef.ValueList);
            var dependencyPropertyDefValueList = dashboard.CustomData.vaultStructureManager.getValueList
                (
                    dashboard.CustomData.vaultStructureManager.getPropertyDefinition(propertyDef.DependencyPD).ValueList
            );
            if (null != dependencyPropertyValue
                && !dependencyPropertyValue.Value.IsNULL()
                && dependencyPropertyDefValueList != null
                && propertyDefValueList != null)
            {
                // Get the values.
                var dependencyLookupValues = dependencyPropertyValue.Value.GetValueAsLookups();

                // Set up the filter string.
                filterString = dependencyPropertyDefValueList.NameSingular + ": ";
                for (var i = 0; i < dependencyLookupValues.Count; i++) 
                {
                    if (i > 0)
                        filterString += ";";
                    filterString += dependencyLookupValues[i].DisplayValue;
                }

                var dependencyCondition = new MFiles.SearchCondition();

                // If the dependency ID is the owner of this list then set it as an owner relationship.
                if (propertyDefValueList.HasOwnerType
                    && propertyDefValueList.OwnerType > 0
                    && propertyDefValueList.OwnerType == dependencyPropertyDefValueList.ID)
                {

                    // It is an owner relationship.
                    dependencyCondition.Expression.SetValueListItemExpression
                        (
                            MFValueListItemPropertyDefOwner,
                            MFParentChildBehaviorNone,
                            new MFiles.DataFunctionCall()
                        );
                }
                else
                {
                    // It's not an owner relationship.
                    dependencyCondition.Expression.SetTypedValueExpression
                        (
                            MFDatatypeLookup,
                            dependencyPropertyDefValueList.ID,
                            MFParentChildBehaviorNone,
                            new MFiles.DataFunctionCall()
                        );
                }

                dependencyCondition.ConditionType = MFConditionTypeEqual;
                dependencyCondition.TypedValue.SetValueToMultiSelectLookup(dependencyLookupValues);
                searchConditions.Add(-1, dependencyCondition);
            }
        }

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

                    // Do we have a filter string?
                    if (filterString.length > 0)
                    {
                        $ol.append($("<li class='caption'></li>").text(filterString));
                    }

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
                            $div.removeClass("options-expanded");
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
    this.renderSingleLookupOption = function ($value, selectedItemId, selectedItemDisplayValue)
    {
        var $div = $("<div></div>").addClass("lookup");
        var $textInput = $("<input type='text' maxlength='100' />")
            .addClass("text-entry");
        var $select = $("<div></div>").addClass("select")
            .append($("<ol></ol>"));
        $textInput.keypress(function (e)
        {
            renderer.renderOptions($div, $textInput, $select, true);
            return true;
        });

        var $dropdown = $("<a />")
            .addClass("dropdown")
            .click(function ()
            {
                // Toggle options.
                $div.toggleClass("options-expanded");
                if ($div.hasClass("options-expanded"))
                {
                    renderer.renderOptions($div, $textInput, $select, false);
                }
                return false;
            });

        $div.append($textInput);
        $div.append($select);
        $div.append($dropdown);
        $value.append($div);
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