function Orchestrator(shellUI)
{
    console.log("Orchestrator activated");

    var t = this;

    var windowManager = null;
    var vaultStructureManager = null;
	var configurationManager = null;
	var selectedItem = null;
	var shellFrame = null;

    t.getWindowManager = function () { return windowManager; }
    t.getVaultStructureManager = function () { return vaultStructureManager; }
	t.getConfigurationManager = function () { return configurationManager; }
	t.getSelectedItem = function () { return selectedItem; }
	t.setSelectedItem = function (i) { selectedItem = i; }
	var eventListeners = {};
	t.addEventListener = function (eventType, callback)
	{
		if (null == eventType || null == callback)
			return null;
		if (typeof (eventListeners[eventType]) == "undefined")
			eventListeners[eventType] = [];
		eventListeners[eventType].push(callback);
	}
	t.dispatchEvent = function ()
	{
		if (arguments.length == 0)
			return;
		var eventType = arguments[0];
		if (typeof (eventListeners[eventType]) == "undefined")
			eventListeners[eventType] = [];
		for (var i = 0; i < eventListeners[eventType].length; i++)
			if (typeof (eventListeners[eventType][i]) == "function")
				eventListeners[eventType][i].apply(t, Array.prototype.slice.call(arguments, 1));
	}

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
		configurationManager = new ConfigurationManager(t, shellUI);

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

			shellFrame.Commands.Events.Register(Event_CustomCommand, customCommandHandler);
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
						if (false == shellListing.IsActive)
							return false;

						// Run each command.
						for (var i = 0; i < customCommands.length; i++)
						{
							var command = customCommands[i];

							// If we can, call it.
							if ((typeof command.handlers.showContextMenu) == "function")
								command.handlers.showContextMenu.call(t, shellFrame, selectedItems);
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
	ConfigurationLoaded: 2
};