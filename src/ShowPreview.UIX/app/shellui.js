"use strict";

function OnNewShellUI(shellUI)
{
	/// <summary>The entry point of ShellUI module.</summary>
	/// <param name="shellUI" type="MFiles.ShellUI">The new shell UI object.</param> 

	// Initialize the console.
	console.initialize(shellUI, "Show preview");

	// The orchestrator orchestrates everything, so let it start up.
	var orchestrator = new Orchestrator(shellUI, "UIHelpers.Modules.ShowPreview.Module");

	// When the user selects different items, show/hide the window.
	orchestrator.addEventListener
		(
			Orchestrator.EventTypes.SelectionChanged,
			function (selectedItems, shellListing)
			{
				// Did we get one item?
				var isOneObjectSelected = selectedItems.Count == 1 && selectedItems.ObjectVersionsAndProperties.Count == 1;
				if (isOneObjectSelected)
				{
					selectedItem = selectedItems.ObjectVersionsAndProperties[0];
				}
				if (false == isOneObjectSelected)
				{
					orchestrator.getWindowManager().close();
					return false;
				}
				orchestrator.getWindowManager().show(false);
			}
		)

	// When the configuration is loaded, we can add our command.
	orchestrator.addEventListener
		(
			Orchestrator.EventTypes.ConfigurationLoaded,
			function (config)
			{
				// Set the tab IDs and title.
				orchestrator.getWindowManager().setTabId(config.ResourceStrings.TabIDs_ShowPreview);
				orchestrator.getWindowManager().setTabTitle(config.ResourceStrings.TabTitles_ShowPreview);

				// Create our command.
				var commandId = null;
				commandId = orchestrator.createCustomCommand
					(
						{
							text: config.ResourceStrings.Commands_ShowPreview,
							location: MenuLocation_ContextMenu_Top,
							priority: 1
						},
						{
							click: function ()
							{
								var selectedItems = orchestrator.getSelectedItems();
								if (null == selectedItems)
									return;

								// Was there only one item selected (and is it an object version)?
								var isOneObjectSelected = selectedItems.Count == 1 && selectedItems.ObjectVersionsAndProperties.Count == 1;

								// Tell the window manager to show the window.
								if (isOneObjectSelected)
									orchestrator.getWindowManager().show(true);
							},
							showContextMenu: function (shellFrame, selectedItems)
							{
								// Was there only one item selected (and is it an object version)?
								var isOneObjectSelected = selectedItems.Count == 1 && selectedItems.ObjectVersionsAndProperties.Count == 1;

								// Show the context menu item only if there is 1 object selected.
								shellFrame.Commands.SetCommandState(
									commandId,
									CommandLocation_All,
									isOneObjectSelected ? CommandState_Active : CommandState_Hidden
								);
							}
						}
					);
			});

}