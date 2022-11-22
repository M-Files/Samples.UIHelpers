function ConfigurationManager(orchestrator, shellUI)
{
    console.log("Configuration manager activated");

	var t = this;

	// Set up the default configuration.
	var configuration = {
		ResourceStrings: {
			Commands_ShowAllMetadata: "Show all metadata",
			Buttons_Close: "Close",
			Buttons_Discard: "Discard",
			Buttons_Save: "Save"
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
			shellUI.Vault.Async.ExtensionMethodOperations.ExecuteVaultExtensionMethod
				(
					"ViewAllMetadata.ShouldShowAllMetadata",
					"",
					function (output)
					{
						// If they should not see it then die here.
						if ((output + "").toLowerCase() != "true")
							return;

						// Pass the language to the server to get the translations.
						shellUI.Vault.Async.ExtensionMethodOperations.ExecuteVaultExtensionMethod
							(
								"ViewAllMetadata.GetUIXConfiguration",
								lang,
								function (output)
								{
									try
									{
										configuration = JSON.parse(output);
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
								},
								function ()
								{
									try
									{
										// Show the button.
										orchestrator.enableShowAllMetadataCommand();
									}
									catch (e)
									{
										MFiles.ReportException(e);
									}
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
		else
		{
			// The extension method doesn't exist.
			// Probably installed in the local install folder, so show for everyone.
			try
			{
				// Show the button.
				orchestrator.enableShowAllMetadataCommand();
			}
			catch (e)
			{
				MFiles.ReportException(e);
			}
		}
	}

    return t;
}