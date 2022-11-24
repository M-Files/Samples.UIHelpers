function ConfigurationManager(orchestrator, shellUI)
{
    console.log("Configuration manager activated");

	var t = this;

	var events = new Events();
	t.addEventListener = events.addEventListener;
	t.dispatchEvent = events.dispatchEvent;

	// Set up the default configuration.
	var configuration = {
		ResourceStrings: {
			Commands_ShowAllMetadata: "Show all metadata",
			Buttons_Close: "Close",
			Buttons_Discard: "Discard",
			Buttons_Save: "Save",
			TabIDs_RawMetadata: "showAllMetadata",
			TabTitles_RawMetadata: "Raw Metadata"
		},
		EnableEditing: false,
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
				"ViewAllMetadata.ShouldShow",
				function (result)
				{
					// If we didn't find it then fail.
					if (!result)
					{
						console.error("VEM ViewAllMetadata.ShouldShow not found.");
						return;
					}

					shellUI.Vault.Async.ExtensionMethodOperations.ExecuteVaultExtensionMethod
					(
						"ViewAllMetadata.ShouldShow",
						"",
						function (output)
						{
							// If they should not see it then die here.
							if ((output + "").toLowerCase() != "true")
								return;
							shellUI.Vault.Async.ExtensionMethodOperations.DoesActiveVaultExtensionMethodExist
							(
								"UIHelpers.GetUIXConfiguration",
								function (result)
								{
									// If we didn't find it then fail.
									if (!result)
									{
										console.error("VEM UIHelpers.GetUIXConfiguration not found.");
										return;
									}

									// Pass the language to the server to get the translations.
									shellUI.Vault.Async.ExtensionMethodOperations.ExecuteVaultExtensionMethod
										(
											"UIHelpers.GetUIXConfiguration",
											JSON.stringify
												(
													{
														Module: "UIHelpers.Modules.ViewAllMetadata.Module",
														Language: lang
													}
												),
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