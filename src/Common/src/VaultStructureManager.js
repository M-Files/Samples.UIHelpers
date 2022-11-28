function VaultStructureManager(orchestrator, shellUI)
{
    console.log("Vault structure manager activated");

	var t = this;

	var events = new Events();
	t.addEventListener = events.addEventListener;
	t.dispatchEvent = events.dispatchEvent;

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