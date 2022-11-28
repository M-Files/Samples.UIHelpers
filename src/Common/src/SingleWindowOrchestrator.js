function SingleWindowOrchestrator(shellUI, moduleName, defaultConfiguration)
{
	var t = this;
	var orchestrator = new Orchestrator(shellUI, moduleName, defaultConfiguration);

	// Map all the entry points.
	t.getModuleName = orchestrator.getModuleName;
	t.getWindowManager = orchestrator.getWindowManager;
	t.getVaultStructureManager = orchestrator.getVaultStructureManager;
	t.getConfigurationManager = orchestrator.getConfigurationManager;
	t.getSelectedItems = orchestrator.getSelectedItems;
	t.addEventListener = orchestrator.addEventListener;
	t.dispatchEvent = orchestrator.dispatchEvent;
	t.createCustomCommand = orchestrator.createCustomCommand;

	// When the user selects different items, show/hide the window.
	t.addEventListener
		(
			Orchestrator.EventTypes.SelectionChanged,
			function (selectedItems, shellListing)
			{
				// Did we get one item?
				var isOneObjectSelected = selectedItems.Count == 1 && selectedItems.ObjectVersionsAndProperties.Count == 1;

				// If not one item then close.
				if (!isOneObjectSelected)
				{
					t.getWindowManager().close();
					return false;
				}

				// Show the single object.
				t.getWindowManager().show(false);
			}
		);

	// When the configuration is loaded, we can add our command.
	t.addEventListener
		(
			Orchestrator.EventTypes.ConfigurationLoaded,
			function (config)
			{
				// Set the tab IDs and title.
				t.getWindowManager().setTabId(moduleName);
				t.getWindowManager().setTabTitle(config.ResourceStrings.TabTitle);

				// Create our command.
				var commandId = null;
				commandId = t.createCustomCommand
					(
						{
							text: config.ResourceStrings.CommandText,
							location: config.CommandLocation,
							priority: CommandLocation.CommandPriority
						},
						{
							click: function ()
							{
								var selectedItems = t.getSelectedItems();
								if (null == selectedItems)
									return;

								// Was there only one item selected (and is it an object version)?
								var isOneObjectSelected = selectedItems.Count == 1 && selectedItems.ObjectVersionsAndProperties.Count == 1;

								// Tell the window manager to show the window.
								if (isOneObjectSelected)
									t.getWindowManager().show(true);
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

	return t;
}