function VaultStructureManager(orchestrator, shellUI)
{
    console.log("Vault structure manager activated");

	var t = this;

	var eventListeners = {};
	t.addEventListener = function (eventType, callback)
	{
		if (null == eventType || null == callback)
			return null;
		if (typeof (eventListeners[eventType]) == "undefined")
			eventListeners[eventType] = [];
		eventListeners[eventType].push(callback);
	}
	t.dispatchEvent = function (eventType)
	{
		if (arguments.length == 0)
			return;
		var eventType = arguments[0];
		if (typeof (eventListeners[eventType]) == "undefined")
			eventListeners[eventType] = [];
		for (var i = 0; i < eventListeners[eventType].length; i++)
			if (typeof (eventListeners[eventType][i]) == "function")
				eventListeners[eventType][i].apply(t, Array.prototype.slice.call(arguments, 1));
	}

	var propertyDefinitions = {};
	var classes = {};

	t.getPropertyDefinition = function(propertyDefId)
	{
		return propertyDefinitions[propertyDefId];
	}

	t.getObjectClass = function(classId)
	{
		return classes[classId];
	}

    t.populate = function ()
    {
		// Load all the property definitions.
		shellUI.Vault.Async.PropertyDefOperations.GetPropertyDefs
			(
				function (output)
				{
					propertyDefinitions = {};
					for (var i = 0; i < output.Count; i++)
					{
						var pd = output[i];
						propertyDefinitions[pd.ID] = pd;
					}
				},
				function (shorterror, longerror, errorobj)
				{
					// Error checking permissions.
					MFiles.ReportException(errorobj);
				}
			);

		// Load all the property definitions.
		shellUI.Vault.Async.ClassOperations.GetAllObjectClasses
			(
				function (output)
				{
					classes = {};
					for (var i = 0; i < output.Count; i++)
					{
						var c = output[i];
						classes[c.ID] = c;
					}
				},
				function (shorterror, longerror, errorobj)
				{
					// Error checking permissions.
					MFiles.ReportException(errorobj);
				}
			);
    }

    return t;
}
VaultStructureManager.EventTypes = {
	Populated: 2
};