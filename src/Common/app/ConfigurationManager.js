function ConfigurationManager(orchestrator, shellUI, moduleName, defaultConfiguration)
{
	console.log("Configuration manager activated for module " + moduleName);
	defaultConfiguration = defaultConfiguration || {};

	var t = this;

	var events = new Events();
	t.addEventListener = events.addEventListener;
	t.dispatchEvent = events.dispatchEvent;

	// Set up the default configuration.
	var configuration = defaultConfiguration;

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
				"UIHelpers.ShouldShow",
				function (result)
				{
					// If we didn't find it then fail.
					if (!result)
					{
						console.error("VEM UIHelpers.ShouldShow not found.");
						return;
					}

					shellUI.Vault.Async.ExtensionMethodOperations.ExecuteVaultExtensionMethod
					(
						"UIHelpers.ShouldShow",
						JSON.stringify
							(
								{
									Module: moduleName
								}
							),
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
														Module: moduleName,
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