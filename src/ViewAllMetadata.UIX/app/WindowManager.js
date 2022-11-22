function WindowManager(orchestrator, shellUI)
{
    console.log("Window manager activated");

	var t = this;
	var registrationCallback = null;
	var tab;
	var tabClosedExplicitly = false;
	var shellFrame = null;

	var currentLocation = 0; // bottom.
	t.getCurrentLocation = function () { return currentLocation; }
	t.setCurrentLocation = function (l) { currentLocation = l; }

	t.close = function (explicit)
	{
		tabClosedExplicitly = explicit;
		if (null != tab)
			tab.Visible = false;
		if (null != shellFrame && null != shellFrame.BottomPane)
		{
			shellFrame.BottomPane.Visible = false;
			shellFrame.BottomPane.Minimized = true;
		}
	}
    
    t.show = function (allowUICreation)
	{
		// If the tab were closed, but we can re-create the UI, then set it to false.
		if (tabClosedExplicitly && allowUICreation)
			tabClosedExplicitly = false;

		// If we have a function then try to call it.
		if (registrationCallback && typeof (registrationCallback) == "function")
		{
			try
			{
				// Show the item details.
				registrationCallback(orchestrator.getSelectedItem());

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
				// No dice; do it the hard way.
			}
		}

		// If we do not allow UI creation then die.
		if (false == allowUICreation)
			return;

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
				tabClosedCallback: t.close,
				vaultStructureManager: orchestrator.getVaultStructureManager(),
				selectedItem: orchestrator.getSelectedItem(),
				configuration: orchestrator.getConfigurationManager().getConfiguration(),
				currentLocation: 0
			}
		);
	};

	function newNormalShellFrameHandler(sf)
	{
		shellFrame = sf;
	}

	// Register to listen new shell frame creation event.
	shellUI.Events.Register(Event_NewNormalShellFrame, newNormalShellFrameHandler);

    return t;
    
}