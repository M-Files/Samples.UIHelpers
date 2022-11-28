"use strict";

function OnNewShellUI(shellUI)
{
	new SingleWindowOrchestrator(shellUI, "UIHelpers.Modules.ViewAllMetadata.Module", {});
}
