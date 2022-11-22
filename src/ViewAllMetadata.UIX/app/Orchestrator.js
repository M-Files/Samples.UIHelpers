function Orchestrator(shellUI)
{
    console.log("Orchestrator activated");

    var t = this;

    var windowManager = null;
    var vaultStructureManager = null;
	var configurationManager = null;
	var showAllMetadataCommandId = null;
	var selectedItem = null;
	var shellFrame = null;

    t.getWindowManager = function () { return windowManager; }
    t.getVaultStructureManager = function () { return vaultStructureManager; }
	t.getConfigurationManager = function () { return configurationManager; }
	t.getSelectedItem = function () { return selectedItem; }
	t.notifyConfigurationChanged = function (config)
	{
		windowManager.configurationChanged(config);
		vaultStructureManager.configurationChanged(config);
	}

    function shellUIStartedHandler()
    {
        // Create and populate the vault structure manager.
        vaultStructureManager = new VaultStructureManager(t, shellUI);
        vaultStructureManager.populate();

        // Ensure the configuration is loaded before anything else.
        configurationManager = new ConfigurationManager(t, shellUI);
		configurationManager.populate();

        // Create the window manager.
        windowManager = new WindowManager(t, shellUI);
	}

	t.enableShowAllMetadataCommand = function()
	{
		// Let's create a button.
		showAllMetadataCommandId = shellFrame.Commands.CreateCustomCommand
			(
				configurationManager.getConfiguration().ResourceStrings.Commands_ShowAllMetadata
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

			// Tell the window manager to show the window.
			windowManager.show(true);
		})
	}

	function newNormalShellFrameHandler(sf)
	{
		/// <summary>Handles the OnNewShellFrame event.</summary>
		/// <param name="shellFrame" type="MFiles.ShellFrame">The new shell frame object.</param>

		var showAllMetadataCommandId = null;
		shellFrame = sf;

		function shellFrameStartedHandler()
		{
			// Sanity.
			if (!shellFrame.BottomPane.Available)
				return;

			windowManager.close();
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
				windowManager.close();
				return false;
			}
			windowManager.show(false);

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
		shellFrame.Events.Register(Event_ViewLocationChangedAsync, windowManager.close);
	}

    // When the ShellUI starts, start all the handlers.
	shellUI.Events.Register(Event_Started, shellUIStartedHandler);

	// Register to listen new shell frame creation event.
	shellUI.Events.Register(Event_NewNormalShellFrame, newNormalShellFrameHandler);

    return t;
}