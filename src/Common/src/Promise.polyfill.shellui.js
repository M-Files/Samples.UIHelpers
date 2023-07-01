function Promise(fn)
{
    var p = this;
    var run = false;
    var success = false;
    var data = null;
    var calledBack = false;
    var thenCallbacks = [];
    var catchCallbacks = [];

    function resolve(d)
    {
        data = d;
        calledBack = true;
        success = true;
        p.then();
    }
    function reject()
    {
        calledBack = true;
        success = false;
        p["catch"]();
    }

    function action()
    {
        try
        {
            run = true;
            fn(resolve, reject);
        }
        catch (e)
        {
            console.log(e);
            MFiles.ThrowError(MFiles.GetLongErrorDescription(e));
        }
    }

    p.then = function (fn)
    {
        if (typeof fn == "function")
            thenCallbacks.push(fn);

        // Have we already run?
        if (run)
        {
            // Sanity.
            if (false == calledBack)
            {
                console.error("Promise execution did not call resolve or reject.");
            }

            // Was it successful?
            if (success)
            {
                for (var i = 0; i < thenCallbacks.length; i++)
                    thenCallbacks[i](data);
            }
            return p;
        }

        return p;
    }

    p["catch"] = function (fn)
    {
        if (typeof fn == "function")
            catchCallbacks.push(fn);

        // Have we already run?
        if (run)
        {
            // Sanity.
            if (false == calledBack)
            {
                console.error("Promise execution did not call resolve or reject.");
            }

            // Was it unsuccessful?
            if (!success)
            {
                for (var i = 0; i < catchCallbacks.length; i++)
                    catchCallbacks[i](data);
            }
            return p;
        }

        return p;
    }

    MFiles.SetTimer(50, action);

    return p;
}