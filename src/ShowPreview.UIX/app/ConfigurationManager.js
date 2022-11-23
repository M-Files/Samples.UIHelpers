function ConfigurationManager(orchestrator, shellUI)
{
    console.log("Configuration manager activated");

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

	// Set up the default configuration.
	var configuration = {
		ResourceStrings: {
			Commands_ShowAllMetadata: "Show all metadata",
			Buttons_Close: "Close",
			Buttons_Discard: "Discard",
			Buttons_Save: "Save",
			TabIDs_ShowPreview: "showPreview",
			TabTitles_ShowPreview: "Show Preview"
		},
		DefaultLocation: 0,
		AllowedLocations: []
	}
	configuration.AllowedLocations.push(0); // Allow bottom pane by default.

	t.getConfiguration = function ()
	{
		return configuration;
	}

	t.populate = function ()
	{
		// Attempt to get the language.
		var lang = MFiles.ReadFromRegistry(false, "", "Language") || "";
		console.log("Client language: " + lang);

		// If we have the VAF app installed then we should check whether this should happen for this user.
		if (typeof (shellUI.Vault.Async.ExtensionMethodOperations.DoesActiveVaultExtensionMethodExist) != "undefined")
		{
			shellUI.Vault.Async.ExtensionMethodOperations.DoesActiveVaultExtensionMethodExist
			(
				"ShowPreview.ShouldShow",
				function (result)
				{
					// If we didn't find it then fail.
					if (!result)
					{
						console.error("VEM ShowPreview.ShouldShow not found.");
						return;
					}

					shellUI.Vault.Async.ExtensionMethodOperations.ExecuteVaultExtensionMethod
					(
						"ShowPreview.ShouldShow",
						"",
						function (output)
						{
							// If they should not see it then die here.
							if ((output + "").toLowerCase() != "true")
								return;
							shellUI.Vault.Async.ExtensionMethodOperations.DoesActiveVaultExtensionMethodExist
							(
								"ShowPreview.GetUIXConfiguration",
								function (result)
								{
									// If we didn't find it then fail.
									if (!result)
									{
										console.error("VEM ShowPreview.GetUIXConfiguration not found.");
										return;
									}

									// Pass the language to the server to get the translations.
									shellUI.Vault.Async.ExtensionMethodOperations.ExecuteVaultExtensionMethod
										(
											"ShowPreview.GetUIXConfiguration",
											lang,
											function (output)
											{
												try
												{
													configuration = JSON.parse(output);
													t.dispatchEvent(ConfigurationManager.EventTypes.Populated, configuration);
												}
												catch (e)
												{
													shellUI.ShowMessage("Exception parsing configuration");
													MFiles.ReportException(e);
												}
											},
											function (shorterror, longerror, errorobj)
											{
												MFiles.ReportException(errorobj);
											}
										);
								}
							);
						},
						function (shorterror, longerror, errorobj)
						{
							// Error checking permissions.
							MFiles.ReportException(errorobj);
						}
					)
				}
			);
		}
		else
		{
			// The extension method doesn't exist.
			// Probably installed in the local install folder, so show for everyone.
			t.dispatchEvent(ConfigurationManager.EventTypes.Populated, configuration);
		}
	}

    return t;
}
ConfigurationManager.EventTypes = {
	Populated: 2
};