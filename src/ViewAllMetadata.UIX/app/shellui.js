"use strict";

function OnNewShellUI(shellUI)
{
	/// <summary>The entry point of ShellUI module.</summary>
	/// <param name="shellUI" type="MFiles.ShellUI">The new shell UI object.</param> 

	// Initialize the console.
	console.initialize(shellUI, "View all metadata");

	// The orchestrator orchestrates everything, so let it start up.
	var orchestrator = new Orchestrator(shellUI);
	orchestrator.addEventListener
		(
			Orchestrator.EventTypes.ConfigurationLoaded,
			function (config)
			{
				var showAllMetadataCommandId = null;
				showAllMetadataCommandId = orchestrator.createCustomCommand
					(
						{
							text: config.ResourceStrings.Commands_ShowAllMetadata,
							location: MenuLocation_ContextMenu_Top,
							priority: 1
						},
						{
							click: function ()
							{
								var selectedItem = orchestrator.getSelectedItem();
								if (null == selectedItem)
									return;

								// Tell the window manager to show the window.
								orchestrator.getWindowManager().show(true);
							},
							showContextMenu: function (shellFrame, selectedItems)
							{
								// Was there only one item selected (and is it an object version)?
								orchestrator.setSelectedItem(null);
								var isOneObjectSelected = selectedItems.Count == 1 && selectedItems.ObjectVersionsAndProperties.Count == 1;
								if (isOneObjectSelected)
								{
									orchestrator.setSelectedItem(selectedItems.ObjectVersionsAndProperties[0]);
								}

								// Show the context menu item only if there is 1 object selected.
								shellFrame.Commands.SetCommandState(
									showAllMetadataCommandId,
									CommandLocation_All,
									isOneObjectSelected ? CommandState_Active : CommandState_Hidden
								);
							}
						}
					);
			});
}