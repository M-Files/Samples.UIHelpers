﻿function WindowManager(orchestrator, shellUI)
{
    console.log("Window manager activated");

	var tabId = null;
	var tabTitle = null;
	var t = this;
	var registrationCallback = null;
	var bottomTab;
	var sideTab;
	var shown = false;
	var tabClosedExplicitly = false;
	var shellFrame = null;
	t.setTabId = function (v) { tabId = v; }
	t.setTabTitle = function (v) { tabTitle = v; }

	var events = new Events();
	t.addEventListener = events.addEventListener;
	t.dispatchEvent = events.dispatchEvent;

	var sizes = {
		popup: {
			height: 800,
			width: 550
			}
	};

	var currentLocation = 0; // bottom.
	t.getCurrentLocation = function () { return currentLocation; }
	t.setCurrentLocation = function (newLocation)
	{
		// Sanity.
		if (currentLocation == newLocation)
			return;

		// Was it shown?
		var s = shown;

		// Close.
		t.close(true);

		// Set the new location.
		currentLocation = newLocation;
		registrationCallback = null;

		// Update vault.
		t.saveDefaultWindowSize();

		// Show.
		if(s)
			t.show(true);
	};

	t.resizePopupWindow = function (window)
	{
		// Note: "window" is an M-Files window instance, not a DOM one.
		switch (currentLocation)
		{
			case 0: // Bottom pane;
				break;
			case 1: // Tab;
				break;
			case 2: // Popup;
				window.SetDefaultSize(sizes.popup.width, sizes.popup.height, true);
				break;
		}
	};
	t.saveDefaultWindowSize = function (width, height)
	{
		// Update the in-memory values.
		sizes.popup.width = width || sizes.popup.width;
		sizes.popup.height = height || sizes.popup.height;

		// Save the values back to the vault.
		if (typeof (shellUI.Vault.Async.ExtensionMethodOperations.DoesActiveVaultExtensionMethodExist) != "undefined")
		{
			shellUI.Vault.Async.ExtensionMethodOperations.DoesActiveVaultExtensionMethodExist
				(
					"UIHelpers.PersistWindowData",
					function (result)
					{
						// If we didn't find it then fail.
						if (!result)
						{
							console.error("VEM UIHelpers.PersistWindowData not found.");
							return;
						}

						shellUI.Vault.Async.ExtensionMethodOperations.ExecuteVaultExtensionMethod
							(
								"UIHelpers.PersistWindowData",
								JSON.stringify
									(
										{
											Module: orchestrator.getModuleName(),
											Location: currentLocation,
											Height: height,
											Width: width
										}
									),
								function (output)
								{
									// If we worked then fantastic.
									if (output == "true")
										return;
									shellUI.ShowMessage(output);
								},
								function (shorterror, longerror, errorobj)
								{
									MFiles.ReportException(errorobj);
								}
							)
					},
					function (shorterror, longerror, errorobj)
					{
						MFiles.ReportException(errorobj);
					}
				);
		}
	}

	var allowedLocations = [0];

	// When the config is updated, update our data.
	orchestrator.addEventListener(Orchestrator.EventTypes.ConfigurationLoaded, function (config)
	{
		sizes.popup.height = config.PopupWindowHeight;
		if (isNaN(parseInt(sizes.popup.height)))
			sizes.popup.height = 800;
		sizes.popup.width = config.PopupWindowWidth;
		if (isNaN(parseInt(sizes.popup.width)))
			sizes.popup.width = 550;
		allowedLocations = config.AllowedLocations;
		t.setCurrentLocation(config.DefaultLocation);
	});

	t.close = function (explicit)
	{
		shown = false;
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
		// If we don't have a tab id or title then fail (can happen before config loaded)
		if (null == tabId || null == tabTitle)
		{
			console.warn("tab ID and title not yet loaded.")
			return;
		}

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
			selectedItems: orchestrator.getSelectedItems(),
			configuration: orchestrator.getConfigurationManager().getConfiguration(),
			currentLocation: currentLocation,
			moduleName: orchestrator.getModuleName()
		};

		// If we have a function then try to call it.
		if (registrationCallback && typeof (registrationCallback) == "function")
		{
			try
			{
				// Show the item details.
				var selectedItems = orchestrator.getSelectedItems()
				if (null == selectedItems)
					return false;
				registrationCallback(selectedItems);

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

					case 1: // Side pane

						// If we did not close explicitly then open again.
						if (!tabClosedExplicitly)
						{
							console.log("Showing on side pane (re-using existing tab)");
							sideTab.Visible = true;
							sideTab.Select();
						}

						break;
				}
				shown = true;
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
					bottomTab = shellFrame.BottomPane.AddTab(tabId, tabTitle, "");
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
					sideTab = shellFrame.RightPane.AddTab(tabId, tabTitle, "");
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
		shown = true;
		return true;
	};

	function newNormalShellFrameHandler(sf)
	{
		shellFrame = sf;
	}

	// Register to listen new shell frame creation event.
	shellUI.Events.Register(Event_NewNormalShellFrame, newNormalShellFrameHandler);

    return t;
    
}