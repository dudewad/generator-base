# Site Configuration

**Read this document thoroughly**. It is critical to how the project functions.

The project resources and settings need to live in a directory outside of the lm-generator-base project directory. The generator-base project is intended only to be used as a submodule, not worked on directly from consuming projects. It is recommended that you check the parent project into a version control system like Git for proper versioning and maintenance as well as data backup.

## Basics

By default when building, the generator-base project will look in the specific `resourcesRoot` for a `settings.json` file. It will also consider this directory the `resourcesRoot` for the project from where all settings paths will be read relative to. For information on how to change these settings, see the main README.md file in the lm-generator-base project root directory.

The `settings.json` file contains settings specific to where resources for the project live, as well as configuration options for building the project. See the `settings.json Spec` section of this document for details on how to write a proper settings.json file. You can also see the `resources-example` directory in the lm-generator-base project root directory for an example of a fully configured project.
 
The site uses a site-data directory that contains json files that tell the project how to build and act. See the `Page and Component Configuration` section for details.

## settings.json Spec

Required values have no default. Optional values have their default values in parenthesis.

There is an example file at `resources-example/settings.json`.

- `build` - `Required` - `Object`
	- Contains information for how the project should build and config options for the local dev server.	
		- `devServer` - `Required` - `Object`
			- Local dev server options. Can be an empty object if its children are defaults.
				- `host` - (`0.0.0.0`) `String`
					- Name to use as 'host' when running the dev server. Recommend using `0.0.0.0` or `localhost`.
				- `port` - (`3000`) - `Number`
					- The port to use.
		- `outputBase` - `Required`
			- Output locations - this is base directory where compiled output will go.
				- `prod` - `Required` - `String`
					- The target location for output when building for prod, i.e. `dist/prod`
				- `staging` - `Required` - `String`
					- The target location for output when building for staging i.e. `dist/staging`
- `font` - `Required` - `Array`
	- Contains font configuration options for each font on the site. This includes automatic font file generation and using both local and remote web fonts. Each index contains a descriptor object as defined below.
		- `FontObject` description
			- `name` - `Required` - `String`
				- The name of the font to be used. This name is used to determine the source and dest directories as well as the font's CSS name.
			- `type` - `Required` - `String`
				- Describes the font's type. Possible values are:
					- `webfont` - Use this when using either a generated font (see the `generated` property for more), or a locally loaded font. When using this value, the `formats` property is required. 
					- `import` - Use this when the font will be loaded form a remote URL. If using this value, the `url` property is required.
			- `weight` - `Required` - `String`
				- The font weight that the font will be declared as in CSS, i.e. `bold`, `normal` or the CSS numeric values such as `300`, `500`, `700`, etc.
			- `style` - `Required` - `String`
				- The font style that the font will be declared as in CSS, i.e. `normal`, `italic`, etc.
			- `formats` - `Required when 'type' is set to 'webfont'` - `Array`
				- These are format objects used to build the CSS font import. Each item in this array is an object as defined below. 
					- `name` - `Required` - `String`
						- The string name of the format, i.e. `truetype` or `woff`.
					- `extension` - `Required` - `String`
						- The actual file extension, i.e. `ttf` or `woff`.
			- `generated` - `Optional` - `Boolean`
				- Set to true if this is a font that should be generated using grunt-webfont.
			- `url` - `Required when 'type' is set to 'import'` - `String`
				- Only set this if `type` is set to `import`. This is the URL to import from.
- `style`
	"overridesBaseDir": "/resources/style",
	"overridesEntryPoint": "custom.scss"
- `url`
	- Contains URL resource locations for the production site. Environment parameters all have the same subset, and are described first:
		- `dev` - `Required` - `Object`
		- `staging` - `Required` - `Object`
		- `prod` - `Required` - `Object`
			- All of the above objects share the below properties. In the case of the `dev` settings, these should just map to their locations relative to the location of the settings file.
				- `dataRoot` - `Required` - `String`
					- The root directory where data files will live on the site. Maps the settings file's `resources.dataRoot` files to their production locations.
				- `contentRoot` - `Required` - `String`
					- The root directory where the content/asset files for the site live. Useful for subdomaining all assets. Maps the settings file's `resources.contentRoot` files to their production locations. 
		- `relative` - `Required` - `Object`
			- Contains directory locations relative to the production content/asset root.
				- `font` - `Required` - `String`
					- The location of the font directory relative to the content root. Usually will just be `/font/`.
				- `image` - `Required` - `String`
					- The location of the base images directory relative to the content root. Usually will just be `/image/`.
- `resources`
	- Contains relative resource paths for building the site.
		- `contentRoot` - `Required` - `String`
			- The root for assets for the site such as fonts, images etc. relative to the location of the settings file.
		- `dataRoot` - `Required` - `String`
			- The root for site data files (the actual site .json files used by the runtime application) relative to the location of the settings file.
		- `fontRoot` - `Required` - `String`
			- The root for the site font files relative to the location of the settings file. This should be inside the `contentRoot` directory.
- `server` - `Required` - `Object`
	- Contains server-config related items
		- `htaccess` - `Required` - `String`
			- The file path of the site's `.htaccess` file relative to the location of the settings file. Presently, an `.htaccess` file is required.

# Page and Component Configuration

This readme contains information on how components are structured via their JSON files.
All page and component configuration options should be captured here.
All configuration files are written in JSON. Understand the basics of how JSON must be formatted because using any incorrect syntax whatsoever will potentially break the entire site. You can run your JSON files through a JSON validator or use an IDE such as Intellij Idea Community Edition for code-syntax highlighting to show you your errors.

## General configuration

Page configuration falls to two tasks: Creating a new page `.json` file, and creating a new route that references that file in the `config.json` file.
Open the site-data directory, and there you should find all site configuration files.

### config.json

The `config.json` file is the primary configuration file that sets up "where" things live on the site. It has the following options:
```
{
    "globalConfig": "global.json",
    "routes": {
        "default": "home.json",
        "/": "home.json",
        "contact": "contact.json"
    }
}
```

 - `globalConfig` should be a sibling file name in the same directory as the `config.json` file. This file is considered the "global" configuration file, and is where all miscellaneous configuration occurs. Mostly this will be used for generic site configuration, and more importantly, non-page-specific components like the header, footer, main menu, etc.
 - `routes` indicates pages as they would appear in the URL bar from the root of the site. For instance, `contact` would load the `contact.json` file when the user accesses `pawsforabeer.com/contact`. 
 There are two special cases:
 `default` will load when a route doesn't match anything.
 `/` will match the root of the site when nothing else is put into the url bar. Basically, it's the home page.

### global.json

The `global.json` file configures non-page items on the site such as the header, footer, main menu, etc. 
**This section is incomplete, and will be updated when these components are considered complete.**

## Page configuration

Page JSON files are broken down into two parts:

```
{   
    "config": {
        "header": true,
        "footer": true,
        "mainMenu": true
    },
    "component": [
        {
            ...
        }
    ]
}
````

#### The Config Object

The `config` key in this file contains numerous options for a given page. Below is a list:

 - `header` - true/false - Whether or not the header is visible on this page.
 - `footer` - true/false - Whether or not the footer is visible on this page.
 - `mainMenu` - true/false - Whether or not the main menu is available on this page.
 
#### The Component Object

The `component` key in this file is intended to contain a list of all components to appear on the page, in order.

Component configuration is defined on a per-component basis (that's what makes them special). In general, however, they  all follow a similar architecture. Many things usable on one component are likely usable on another. Below is a comprehensive list of components and their configuration options.

All components have three root-level properties:

 - `type` - Exactly what it sounds like - set this to the type of the component. It must match exactly to an existing component type or it will be left out. This is the first thing to check when you change a config and a component won't appear.
 - `config` - A set of configuration options for the component as a whole, like background, CSS classname, etc.
 - `content` - This is the meat and potatoes of the component config. All content configuration goes here including text, image references, button config, etc.

Some notes:

 - You can write actual HTML into most component content entries. Pretty cool, but really only intended to wrap text in `span` tags to give classes like `accent` to it to color text. Use it sparingly.
 - Almost all elements are optional, except where an element is really a main part of the component. For example, the paragraph or CTA buttons in the Hero component are optional, where the image in the TextImage component is not.
 
### Generic Config Options

These options are common to all configurations and will not be listed in each component's config docs. Learn these ones well, because you _will_ need them!

 - `class` This is simply an array of CSS class names as strings. Nothing special. They will all be applied to the outer component element.
 - `background` This allows you to set the background for a given element. It has the following properties:
    - `style` Possible values are `image` and `color`. Tells the component what _type_ of background it will have. Before changing the color explicitly, try checking to see if there are any pre-defined classes that fit the brand better. You could use a CSS class name in the config's class section to make this a cleaner implementation, that way when any values get updated for that CSS class they update site-wide and you don't have to change all your configs everywhere.
    - `value` This refers to the value of the background itself. If it's an image, it needs to be a URL relative to the content root of the site. If it's a color, it needs to be a hex value, i.e. `#0099FF`
    - `size` This will take any valid CSS size property, including keywords like `cover`. Can also use percentages, etc. This should be used carefully, usually the standard background style should cover it.
    - `position` This will change the position from the default of `center`. If you want to make sure the bottom-left of a background is always visible, you can pass it those values `bottom left` and they will be used instead of the default.

### Generic Content Options

Like the generic config options, there are certain content options that are duplicated across components. They are explained here, and won't be explained in their component sections, so learn these well! As above, you _will_ need them!

    "content": {
        "cta": {
            "text": "Learn More",
            "href": "http://www.google.com",
            "route": "/contact"
        }
    }

#### CTA
The CTA content item is a button style that is used site-wide. It is intended to be an eye-catching 'call to action'. It contains the following two keys:

 - `text` - The text that will be displayed on the button
 - `href` - The location that the button should link to for _external links only_
 - `route` - If the location for the button is supposed to be a link _inside_ the site, create it as a `route` rather than an `http` key, and create it as a url local to the site (see the example). _Do not_ include the site root (i.e. www.pawsforabeer.com). Full URLs are reserved for the `href` key. 

**Note:** The example may be confusing because it uses both `href` and `route`, however you  should only use _one_ of these at a time. Unpredictable behavior will result if you don't heed this warning.

### Hero

Description: The Hero component is intended for big, in-your-face landing page scenarios. Usually reserved for the top of the home page or other important pages. It takes up a ton of space and provides little content; intended for use with a flashy full-screen background.

Example configuration:

```
{
    "type": "Hero",
    "config": {
        "class": [
            "compensate-header"
        ],
        "background": {
            "style": "image",
            "value": "image/structure-bg-bar-1.jpg"
        }
    },
    "content": {
        "title": "A Subdued <span class='accent'>Dog</span> Bar",
        "subtitle": "Awesome Bellingham <span class='accent'>beer, dogs,</span> and <span class='accent'>good times</span>",
        "body": "We serve delicious beer in cans so that your dog can come into the bar without violating health code by pooping all over the place, particularly in peoples' food.",
        "cta": {
            "text": "Learn More",
            "href": "/contact"
        }
    }
}
```

This component has no custom config options. See the Global Config section for details on those options.

The content section has the following options:

 - `title` The primary title.
 - `subtitle` The subtitle.
 - `body` Paragraph-style text. Should be short (i.e. 2-3 sentences).
 - `cta` See the CTA description in the general content section for more.
 
### TextImage

Description: The TextImage component is intended for repeatable, alternating (left/right) usage down a page, that contains an interesting image with a title and a short block of copy designed to drill a user further into the site, or provide some interesting information. On desktop, the image will be the same height as the block of copy (with a minimum height) so don't try to put too much content here, that's not really what it's for.

Example configuration:

```
{
    "type": "TextImage",
    "config": {
        "class": [
            "content-right",
            "text-centered"
        ],
        "background": {}
    },
    "content": {
        "title": "Seriously, we are Awesome",
        "body": "Back on the dogs vs cats thing. Literally, cats are really bad ass. In theory. The problem is, they're actually huge dickheads. Evolutionarily that doesn't make a lot of sense. It's 2016, we don't live in the jungle, bitches. Stop being dicks to everyone and we'll all like you a little more. Take dogs as an example. Kbye.",
        "image": "content/image/structure-bg-crosby-1.jpg",
        "cta": {
            "text": "Awesome",
            "href": "/contact"
        }
    }
}
```

Custom configuration options include:

 - Custom classes for this component.
    - `content-right` - Places the content on the right side of the component (image left). Should be used when not using `content-left`.
    - `content-left` - places the content on the left side of the component (image right). Should be used when not using `content-right`.
    - `text-centered` - Will center-align the text. The default behavior is to align the text against the image; this will override that.


The content section has the following options:

 - `title` The primary title.
 - `body` Paragraph-style text. Try to keep it short to medium in length.
 - `image` An image reference to use, which will be juxtaposed against the content.
 - `cta` See the CTA description in the general content section for more.
 
 ### TileSet \[NEEDS UPDATING\]
 
 Description: 
 
 Example configuration:
 
 ```

 ```
 
 Custom configuration options include:
 
  - 
 
 The content section has the following options:
 
 - 