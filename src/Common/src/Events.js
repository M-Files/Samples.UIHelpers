function Events()
{
	var eventListeners = {};
	var e = this;
	e.addEventListener = function (eventType, callback)
	{
		if (null == eventType || null == callback)
			return null;
		if (typeof (eventListeners[eventType]) == "undefined")
			eventListeners[eventType] = [];
		eventListeners[eventType].push(callback);
	}
	e.dispatchEvent = function ()
	{
		if (arguments.length == 0)
			return;
		var eventType = arguments[0];
		if (typeof (eventListeners[eventType]) == "undefined")
			eventListeners[eventType] = [];
		for (var i = 0; i < eventListeners[eventType].length; i++)
			if (typeof (eventListeners[eventType][i]) == "function")
				eventListeners[eventType][i].apply(e, Array.prototype.slice.call(arguments, 1));
	}
}