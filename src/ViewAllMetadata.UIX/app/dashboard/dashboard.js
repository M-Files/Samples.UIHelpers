"use strict";

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_customParseFormat);
dayjs.extend(window.dayjs_plugin_localizedFormat);
dayjs().utcOffset(new Date().getTimezoneOffset());

(function ()
{

    // Set up the dashboard.
    var dashboard = new Dashboard();

    // Our renderer will be set up later.
    var renderer = null;

    // Re-render when the selected items change.
    dashboard.addEventListener(Dashboard.EventTypes.SelectionChanged, function (selectedItems)
    {
        // Lazy-instantiate the renderer.
        renderer = renderer || new ObjectRenderer(dashboard.getUIXDashboard());

        // Was there only one item selected (and is it an object version)?
        var isOneObjectSelected = selectedItems.Count == 1 && selectedItems.ObjectVersionsAndProperties.Count == 1;

        // We can render one only.
        if (isOneObjectSelected)
            renderer.render(selectedItems.ObjectVersionsAndProperties[0]);
        else
        {
            $("body").css({ "background-color": "red" });
        }
    });

})();