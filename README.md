# UI Helpers

These are some example UIX applications showing how commonly-requested functionality can be created and maintained by third parties.

**NOTE: This code is produced as an open-source sample.  M-Files can provide no support on its use, nor can be held responsible for issues caused by its use or misuse.**

## Getting started

### Installation

This application is designed to be distributed via the compiled `UIHelpers.mfappx` file.  This can be installed to the vault using [M-Files Admin](https://www.m-files.com/user-guide/latest/eng/Applications.html).  The application must be built from the source code in this repository; M-Files does not distribute compiled versions.

### Configuration

Once installed, navigate to the vault's `Configuration` section, expand `Other Applications` and select `UI Helpers`.  Selecting the `Configuration` tab will allow each module to be configured separately.  Common module configuration includes:

* Whether the module is enabled or not.
* Which users can access the module (either by role - e.g. "all users with the full control role" - or by specifically allowing access to certain users or groups).
* Control over any UI components that the module contains (e.g. the default height/width of the popup window, which locations the UI component can be shown in, etc.).
* The ability to provide translations for common UI elements that are automatically applied based on the desktop language of the user.
* Logging.

## Available modules

### Show preview

This module allows users to view the preview of an object either in the "bottom pane" (below the listing) or in a popout window.  This allows the user to view both the preview and metadata card at the same time.

By default this module is **not enabled**.  When enabled it defaults to allowing **all users** to see the preview.  These defaults can be changed in the configuration.

To start, ensure that the [module is activated and your user has access](#getting-started) then open M-Files Desktop, right-click on an object and select `Show preview`.  The preview appears below the listing, but can be toggled to other locations using the icons in the Function Ribbon.  The preview can be closed by clicking the `Close` button.

### View all metadata

This module allows users to view the metadata of an object without Metadata Card Configuration rules applied.  This can be useful in some situations (e.g. to debug Metadata Card Configuration rules).  **Note: Metadata Card Configuration rules should never be used instead of proper property-level permissions.**

By default this module is **not enabled**.  When enabled it defaults to allowing **users with the full control of vault role** to see all metadata.  These defaults can be changed in the configuration.

To start, ensure that the [module is activated and your user has access](#getting-started) then open M-Files Desktop, right-click on an object and select `View all metadata`.  The raw metadata appears below the listing, but can be toggled to other locations using the icons in the Function Ribbon.  The metadata card can be closed by clicking the `Close` button.

## Project structure

### UIHelpers.csproj

The core project that declares the various modules that are available.  Each module consists of server-side components, held in this project, and optional client-side components, held in their own project.

### Common.csproj

A project containing common files for use in client-side (UIX) components.  Individual files in the `src` folder can be linked as-is (although note that they may have dependencies), but the recommended approach is to link to the associated files in the `bundle` folder, which are created automatically on build.  The definition for these bundled files can be seen in `bundleconfig.json`.

### ShowPreview.UIX.csproj

A pure-JavaScript UIX application that allows the user to view previews of the selected object.

* `app\shellui.js` contains the application entry point.
* `app\dashboard\dashboard.js` contains the dashboard entry point.
* `app\scripts\renderers\objectrenderer.js` contains the `render` method which is called when an object is selected, and which renders the preview itself.

### ViewAllMetadata.UIX.csproj

A pure-JavaScript UIX application that allows the user to view the metadata card of the selected object without any metadata card configuration rules applied.

* `app\shellui.js` contains the application entry point.
* `app\dashboard\dashboard.js` contains the dashboard entry point.
* `app\scripts\renderers\objectrenderer.js` contains the `render` method which is called when an object is selected, and which renders the properties to the screen.
* `app\scripts\renderers\*PropertyValueRenderer.js` contain renderers for different property data types.
