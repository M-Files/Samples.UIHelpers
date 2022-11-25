function Orchestrator(shellUI, moduleName, defaultConfiguration)
{
    console.log("Orchestrator activated");

    var t = this;

    var windowManager = null;
    var vaultStructureManager = null;
	var configurationManager = null;
	var selectedItems = null;
	var shellFrame = null;

	t.getModuleName = function () { return moduleName; }
    t.getWindowManager = function () { return windowManager; }
    t.getVaultStructureManager = function () { return vaultStructureManager; }
	t.getConfigurationManager = function () { return configurationManager; }
	t.getSelectedItems = function () { return selectedItems; }

	var events = new Events();
	t.addEventListener = events.addEventListener;
	t.dispatchEvent = events.dispatchEvent;

	var customCommands = [];
	t.createCustomCommand = function (commandDetails, handlers)
	{
		if (null == commandDetails)
			return null;

		// Let's create a button.
		var commandId = shellFrame.Commands.CreateCustomCommand(commandDetails.text);

		// Let's add it to the context menu.
		shellFrame.Commands.AddCustomCommandToMenu(commandId, commandDetails.location, commandDetails.priority);

		customCommands.push({
			commandId: commandId,
			handlers: handlers
		});

		return commandId;
	}

    function shellUIStartedHandler()
    {
        // Create the vault structure manager.
        vaultStructureManager = new VaultStructureManager(t, shellUI);

        // Create the configuration manager.
		configurationManager = new ConfigurationManager(t, shellUI, moduleName, defaultConfiguration);

		// When the configuration is loaded, push it everywhere.
		configurationManager.addEventListener(ConfigurationManager.EventTypes.Populated, function (config)
		{
			t.dispatchEvent(Orchestrator.EventTypes.ConfigurationLoaded, config);
		})

        // Create the window manager.
		windowManager = new WindowManager(t, shellUI);
	}

	function customCommandHandler(commandId)
	{
		for (var i = 0; i < customCommands.length; i++)
		{
			var command = customCommands[i];
			if (command.commandId != commandId)
				continue;

			// If we can, call it.
			if ((typeof command.handlers.click) == "function")
				command.handlers.click.call(t);
		}
	}

	function newNormalShellFrameHandler(sf)
	{
		/// <summary>Handles the OnNewShellFrame event.</summary>
		/// <param name="shellFrame" type="MFiles.ShellFrame">The new shell frame object.</param>

		shellFrame = sf;

		function shellFrameStartedHandler()
		{
			// Populate everything.
			vaultStructureManager.populate();
			configurationManager.populate();

			// Register our handler for any custom commands.
			shellFrame.Commands.Events.Register(Event_CustomCommand, customCommandHandler);

			// When the shell frame starts nothing is selected, so close the window.
			windowManager.close();
		}

		function selectionChangedHandler(si, shellListing)
		{
			// Sanity.
			if (false == shellListing.IsActive)
			{
				return false;
			}

			// Store the selected items.
			selectedItems = si;

			// Raise any events.
			t.dispatchEvent(Orchestrator.EventTypes.SelectionChanged, si, shellListing);

		}
		function shellListingStartedHandler(shellListing)
		{
			// Listen for selection change events on the listing
			shellListing.Events.Register
				(
					Event_ShowContextMenu,
					function (si)
					{
						// Sanity.
						if (false == shellListing.IsActive)
							return false;

						selectedItems = si;

						// Run each command.
						for (var i = 0; i < customCommands.length; i++)
						{
							var command = customCommands[i];

							// If we can, call it.
							if ((typeof command.handlers.showContextMenu) == "function")
								command.handlers.showContextMenu.call(t, shellFrame, si);
						}

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
Orchestrator.EventTypes = {
	Started: 1,
	ConfigurationLoaded: 2,
	SelectionChanged: 3
};