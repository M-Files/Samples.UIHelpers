"use strict";

function OnNewShellUI(shellUI)
{
	/// <summary>The entry point of ShellUI module.</summary>
	/// <param name="shellUI" type="MFiles.ShellUI">The new shell UI object.</param> 

	// Initialize the console.
	console.initialize(shellUI, "View all metadata");

	var propertyDefinitions = {};
	var classes = {};

    function shellUIStartedHandler()
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

	// Load the property definitions when the UI starts.
	shellUI.Events.Register(Event_Started, shellUIStartedHandler);

	// Register to listen new shell frame creation event.
	shellUI.Events.Register
	(
		Event_NewNormalShellFrame,
		function (shellFrame)
		{
			/// <summary>Handles the OnNewShellFrame event.</summary>
			/// <param name="shellFrame" type="MFiles.ShellFrame">The new shell frame object.</param>

			var showAllMetadataCommandId = null;
			var selectedItem = null;
			var registrationCallback = null;
			var tab = null;

			// Set up the default configuration.
			var configuration = {
				ResourceStrings: {
					Commands_ShowAllMetadata: "Show all metadata",
					Buttons_Close: "Close",
					Buttons_Discard: "Discard",
					Buttons_Save: "Save"
                }
			}

			function shellFrameStartedHandler()
			{
				// Sanity.
				if (!shellFrame.BottomPane.Available)
					return;

				tabClosed();

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
											shellFrame.ShowMessage("Exception parsing configuration");
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
											enableShowAllMetadataCommand();
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
						enableShowAllMetadataCommand();
					}
					catch (e)
					{
						MFiles.ReportException(e);
					}
				}
			}

			var tabClosedExplicitly = false;
            function tabClosed(explicit)
			{
				tabClosedExplicitly = explicit;
				if(null != tab)
					tab.Visible = false;
				shellFrame.BottomPane.Visible = false;
				shellFrame.BottomPane.Minimized = true;
			}

			function getPropertyDefinition(propertyDefId)
			{
				return propertyDefinitions[propertyDefId];
			}

			function getObjectClass(classId)
			{
				return classes[classId];
			}

			function enableShowAllMetadataCommand()
			{
				// Let's create a button.
				showAllMetadataCommandId = shellFrame.Commands.CreateCustomCommand
					(
						configuration.ResourceStrings.Commands_ShowAllMetadata
					);

				// Let's add it to the context menu.
				shellFrame.Commands.AddCustomCommandToMenu(showAllMetadataCommandId, MenuLocation_ContextMenu_Top, 1);

				// Register to respond to events.
				shellFrame.Commands.Events.Register(Event_CustomCommand, function (command)
				{
					// We only care about our command.
					if (command != showAllMetadataCommandId)
						return;
					if (null == selectedItem)
						return;

					// If we have a function then try to call it.
                    if (registrationCallback && typeof (registrationCallback) == "function")
					{
						try
						{
							// Try to call it.
							shellFrame.BottomPane.Visible = true;
							shellFrame.BottomPane.Minimized = false;
							tab.Visible = true;
							tab.Select();
							registrationCallback(selectedItem);
							return true;
						}
                        catch (e)
						{
							// No dice; do it the hard way.
                        }
					}

					// Do we have a tab?
					if (null == tab)
					{
						tab = shellFrame.BottomPane.AddTab("showAllMetadata", "Metadata", "");
					}

					// Show the bottom pane.
					tab.Visible = true;
					tab.Select();
					shellFrame.BottomPane.Visible = true;
					shellFrame.BottomPane.Minimized = false;

					tab.ShowDashboard
					(
						"Dashboard",
						{
							registrationCallback: function (fn)
							{
								registrationCallback = fn
							},
							tabClosedCallback: tabClosed,
							getPropertyDefinition: getPropertyDefinition,
							getObjectClass: getObjectClass,
							selectedItem: selectedItem,
							resourceStrings: configuration.ResourceStrings
						}
					);
				})
			}
            function selectionChangedHandler(selectedItems, shellListing)
			{
				// Sanity.
				if (false == shellListing.IsActive)
				{
					return false;
				}

				// Did we get one item?
				selectedItem = null;
				var isOneObjectSelected = selectedItems.Count == 1 && selectedItems.ObjectVersionsAndProperties.Count == 1;
				if (isOneObjectSelected)
				{
					selectedItem = selectedItems.ObjectVersionsAndProperties[0];
				}
				if (false == isOneObjectSelected)
				{
					tabClosed();
					return false;
				}

				// If the tab is configured and we can call into the dashboard then select the new object.
				if (null == tab || null == registrationCallback)
					return false;;
				try
				{
					// Show the item details.
					registrationCallback(selectedItem);

					// If we did not close explicitly then open again.
                    if (!tabClosedExplicitly)
					{
						tab.Visible = true;
						shellFrame.BottomPane.Visible = true;
						shellFrame.BottomPane.Minimized = false;
                    }

					tab.Select();
					return true;
				}
                catch (e)
				{
					return false;
                }

            }
			function shellListingStartedHandler(shellListing)
			{
				// Listen for selection change events on the listing
				shellListing.Events.Register
				(
					Event_ShowContextMenu,
					function (selectedItems)
					{
						// Sanity.
						if (false == shellListing.IsActive
								|| null == showAllMetadataCommandId)
							return false;

						// Was there only one item selected (and is it an object version)?
						selectedItem = null;
						var isOneObjectSelected = selectedItems.Count == 1 && selectedItems.ObjectVersionsAndProperties.Count == 1;
						if (isOneObjectSelected)
						{
							selectedItem = selectedItems.ObjectVersionsAndProperties[0];
                        }

						// Show the context menu item only if there is 1 object selected.
						shellFrame.Commands.SetCommandState(
							showAllMetadataCommandId,
							CommandLocation_All,
							isOneObjectSelected ? CommandState_Active : CommandState_Hidden
						);

						return true;
					}
				);
			}

			// Register shell frame events.
			shellFrame.Events.Register(Event_Started, shellFrameStartedHandler);
			shellFrame.Events.Register(Event_NewShellListing, shellListingStartedHandler);
			shellFrame.Events.Register(Event_SelectionChanged, selectionChangedHandler);
			shellFrame.Events.Register(Event_SelectedItemsChanged, selectionChangedHandler);
			shellFrame.Events.Register(Event_ViewLocationChangedAsync, tabClosed);
		}
	);

}