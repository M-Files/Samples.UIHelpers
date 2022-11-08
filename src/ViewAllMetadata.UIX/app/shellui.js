"use strict";

function OnNewShellUI(shellUI)
{
	/// <summary>The entry point of ShellUI module.</summary>
	/// <param name="shellUI" type="MFiles.ShellUI">The new shell UI object.</param> 

	// Initialize the console.
	console.initialize(shellUI, "Separate Preview");

	var dashboardCallback = null;
	var showPreviewCommandId = null;
	var isWindowOpen = false;

	// Register to listen new shell frame creation event.
	shellUI.Events.Register
	(
		Event_NewNormalShellFrame,
		function (shellFrame)
		{
			/// <summary>Handles the OnNewShellFrame event.</summary>
			/// <param name="shellFrame" type="MFiles.ShellFrame">The new shell frame object.</param>

			// Set up the default configuration.
			var configuration = {
				TaskPaneConfiguration: {
					TaskPaneGroup: 2, // ViewAndModify
					Priority: 0
				},
				ResourceStrings: {
					Commands_OpenPreviewWindow: "Open Preview Window",
					PreviewWindow_Title: "Preview",
					PreviewWindow_PleaseSelectADocument: "Please select a document."
                }
			}

			function markWindowAsOpen()
			{
				/// <summary>Marks the window as open so that we don't spawn a new one.</summary>

				// Update the global variable.
				isWindowOpen = true;

				// Disable the command.
				shellFrame.Commands.SetCommandState(showPreviewCommandId, CommandLocation_All, CommandState_Inactive);
			}

			function markWindowAsClosed()
			{
				/// <summary>Marks the window as closed so that we can spawn a new one.</summary>

				// Update the global variable.
				isWindowOpen = false;

				// Disable the command.
				shellFrame.Commands.SetCommandState(showPreviewCommandId, CommandLocation_All, CommandState_Active);
			}

			function shellFrameStartedHandler()
			{
				// Attempt to get the language.
				var lang = MFiles.ReadFromRegistry(false, "", "Language") || "";
				console.log("Client language: " + lang);

				// Pass the language to the server to get the translations.
				shellFrame.ShellUI.Vault.Async.ExtensionMethodOperations.ExecuteVaultExtensionMethod
					(
						"SeparatePreview.GetUIXConfiguration",
						lang,
						function (output)
						{
							try
							{
								configuration = JSON.parse(output);
							}
							catch(e)
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
								enablePreviewCommand();
							}
							catch (e)
							{
								shellFrame.ShowMessage("Exception showing preview command");
								MFiles.ReportException(e);
                            }
                        }
					);
			}

			function enablePreviewCommand()
			{
				// Let's create a button.
				showPreviewCommandId = shellFrame.Commands.CreateCustomCommand
					(
						configuration.ResourceStrings.Commands_OpenPreviewWindow
					);

				// Let's add it to the task pane.
				// ref: http://www.m-files.com/UI_Extensibility_Framework/index.html#MFClientScript~ITaskPane~AddCustomCommandToGroup.html
				shellFrame.Commands.SetIconFromPath(showPreviewCommandId, "loupe1.ico");
				shellFrame.TaskPane.AddCustomCommandToGroup
					(
						showPreviewCommandId,
						configuration.TaskPaneConfiguration.TaskPaneGroup,
						configuration.TaskPaneConfiguration.Priority
					);

				// Register to respond to events.
				shellFrame.Commands.Events.Register(Event_CustomCommand, function (command)
				{
					// We only care about our command.
					if (command != showPreviewCommandId)
						return;

					// Is the window already open?
					if (isWindowOpen)
						return;

					// Show the dashboard.
					shellUI.ShowPopupDashboard("PreviewDashboard", false, {
						configuration: configuration,
						registrationCallback: function (callback)
						{
							// We can use the function passed to push data back to the persistent dashboard.
							dashboardCallback = callback;
						},
						windowClosed: function ()
						{
							// When the dashboard is closed, mark it as closed so that we can open a new one.
							markWindowAsClosed();
						}
					});

					// Mark the window as open.
					markWindowAsOpen();

				})

				// Set the initial command state.
				shellFrame.Commands.SetCommandState(showPreviewCommandId, CommandLocation_All, isWindowOpen ? CommandState_Inactive : CommandState_Active);
            }
			function shellListingStartedHandler(shellListing)
			{
				// Listen for selection change events on the listing
				shellListing.Events.Register(Event_SelectionChanged, function (selectedItems)
				{

					if (false == shellListing.IsActive)
						return;

					// Sanity.
					if (selectedItems.ObjectVersions.Count == 0)
						return;

					// If we have a means to alert the dashboard of the selected item then do so.
					if (null != dashboardCallback)
					{
						try
						{
							// Call the callback, passing the selected item.
							dashboardCallback(selectedItems);
						}
						catch (e)
						{

						}
					}
				});
            }

			// Register to listen to the started event.
			shellFrame.Events.Register(Event_Started, shellFrameStartedHandler);
			shellFrame.Events.Register(Event_NewShellListing, shellListingStartedHandler);
		}
	);

}