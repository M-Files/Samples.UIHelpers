function WindowManager(orchestrator, shellUI)
{
    console.log("Window manager activated");

	var t = this;
	var registrationCallback = null;
	var bottomTab;
	var sideTab;
	var tabClosedExplicitly = false;
	var shellFrame = null;

	var eventListeners = {};
	t.addEventListener = function (eventType, callback)
	{
		if (null == eventType || null == callback)
			return null;
		if (typeof (eventListeners[eventType]) == "undefined")
			eventListeners[eventType] = [];
		eventListeners[eventType].push(callback);
	}
	t.dispatchEvent = function (eventType)
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

	var currentLocation = 0; // bottom.
	t.getCurrentLocation = function () { return currentLocation; }
	t.setCurrentLocation = function (newLocation)
	{
		// Sanity.
		if (currentLocation == newLocation)
			return;

		// Close.
		t.close(true);

		// Set the new location.
		currentLocation = newLocation;
		registrationCallback = null;

		// Show.
		t.show(true);
	};

	var allowedLocations = [0];

	// When the config is updated, update our data.
	orchestrator.addEventListener(Orchestrator.EventTypes.ConfigurationLoaded, function (config)
	{
		allowedLocations = config.AllowedLocations;
		t.setCurrentLocation(config.DefaultLocation);
	});

	t.close = function (explicit)
	{
		tabClosedExplicitly = explicit;

		switch (currentLocation)
		{
			case 0: // Bottom pane.

				console.log("Closing bottom pane (explicit: " + explicit + ")");

				if (null != bottomTab)
					bottomTab.Visible = false;
				if (null != shellFrame && null != shellFrame.BottomPane)
				{
					shellFrame.BottomPane.Visible = false;
					shellFrame.BottomPane.Minimized = true;
				}
				break;

			case 1: // Right-hand pane.

				console.log("Closing right-hand pane (explicit: " + explicit + ")");

				if (null != sideTab)
					sideTab.Visible = false;
				break;

			default:

				console.warn("Unhandled location type:" + currentLocation);

				break;
		}
	}
    
	t.show = function (allowUICreation)
	{
		// If the tab were closed, but we can re-create the UI, then set it to false.
		if (tabClosedExplicitly && allowUICreation)
		{
			console.log("Tab was closed and not allowed to create UI; not showing.")
			tabClosedExplicitly = false;
		}

		// Define the data to send to the dashboard.
		var customData = {
			registrationCallback: function (fn)
			{
				registrationCallback = fn
			},
			tabClosedCallback: t.close,
			windowManager: orchestrator.getWindowManager(),
			vaultStructureManager: orchestrator.getVaultStructureManager(),
			selectedItem: orchestrator.getSelectedItem(),
			configuration: orchestrator.getConfigurationManager().getConfiguration(),
			currentLocation: currentLocation
		};

		// If we have a function then try to call it.
		if (registrationCallback && typeof (registrationCallback) == "function")
		{
			try
			{
				// Show the item details.
				var selectedItem = orchestrator.getSelectedItem()
				if (null == selectedItem)
					return false;
				console.log("Selecting item " + selectedItem.VersionData.Title);
				registrationCallback(selectedItem);

				switch (currentLocation)
				{
					case 0: // Bottom pane

						// If we did not close explicitly then open again.
						if (!tabClosedExplicitly)
						{
							console.log("Showing on bottom pane (re-using existing tab)");

							bottomTab.Visible = true;
							shellFrame.BottomPane.Visible = true;
							shellFrame.BottomPane.Minimized = false;
							bottomTab.Select();
						}

						break;

					case 1: // Bottom pane

						// If we did not close explicitly then open again.
						if (!tabClosedExplicitly)
						{
							console.log("Showing on side pane (re-using existing tab)");
							sideTab.Visible = true;
						}

						break;

					default:

						console.warn("Unhandled location type:" + currentLocation);

						break;
				}
				return true;
			}
			catch (e)
			{
				// No dice; do it the hard way.
			}
		}

		// If we do not allow UI creation then die.
		if (false == allowUICreation)
		{
			console.log("Not allowed to create UI; not showing.");
			return;
		}

		switch (currentLocation)
		{
			case 0: // Bottom tab

				console.log("Showing on bottom pane");

				// Do we have a bottom tab?
				if (null == bottomTab)
				{
					console.log("Creating bottom tab");
					bottomTab = shellFrame.BottomPane.AddTab("showAllMetadata", "Raw Metadata", "");
				}

				// Show the bottom pane.
				bottomTab.Visible = true;
				bottomTab.Select();
				shellFrame.BottomPane.Visible = true;
				shellFrame.BottomPane.Minimized = false;

				bottomTab.ShowDashboard
					(
						"Dashboard",
						customData
					);
				break;

			case 1: // Right-hand pane.

				console.log("Showing on right-hand pane")

				// Do we have a side tab?
				if (null == sideTab)
				{
					console.log("Creating bottom tab");
					sideTab = shellFrame.RightPane.AddTab("showAllMetadata", "Raw Metadata", "");
				}

				// Show the side pane.
				sideTab.Visible = true;

				sideTab.ShowDashboard
					(
						"Dashboard",
						customData
					);

				break;

			case 2: // Popup

				shellUI.ShowPopupDashboard
				(
					"Dashboard",
					false,
					customData
				)

			default:

				console.warn("Unhandled location type:" + currentLocation);

				break;
		}
	};

	function newNormalShellFrameHandler(sf)
	{
		shellFrame = sf;
	}

	// Register to listen new shell frame creation event.
	shellUI.Events.Register(Event_NewNormalShellFrame, newNormalShellFrameHandler);

    return t;
    
}