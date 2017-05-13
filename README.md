# LM Generator Base

## Setup

###Installing Dependencies

The project has some dependencies. They should be installed in the order below.

 - NodeJS
 - Grunt CLI

You'll need to have NodeJS installed to work on this site.
You can download/install it here: [www.nodejs.org](www.nodejs.org)

Once Node is installed, installing the actual project dependencies is easy. In a terminal/command prompt, navigate to the project root directory and run:

`npm install`

This will download a pile of dependencies to your project directory. You can now forget that this is even a thing, since you only have to do this once to set up the project.

One dependency that can't be automatically installed is the `grunt-cli` tool. If you don't have it (or don't know what it is, in which case, you don't have it), you'll need to install it. This one can be easily installed via NPM as well:

`npm install -g grunt-cli`

Congratulations. Your dependencies are ready to rock.

## Running the dev server

You won't really be able to do any work on the site without the dev server running. To start the dev server, navigate to the lm-generator-base root directory in a command prompt/terminal, and run the following command to start it:

`npm start`

Once the module bundler (Webpack) finishes starting up, you can access the site by going to the URL it specifies in the terminal. It will say something like `Listening at http://127.0.0.1:3000`. Navigate to that URL to see the site. In the event that the address is `http://0.0.0.0:xxxx` where 0.0.0.0 is the host name, using that URL may not work. In that case, replace `0.0.0.0` with `127.0.0.1` or `localhost`

This webpack instance is configured to automatically refresh whenever file changes occur. You shouldn't need to refresh the browser as you work. However, keep in mind that changing configuration files will require a manual refresh since it doesn't watch those files.

## Generating Staging and Production Code
Need staging or production code? Easy!

*Note:* Always run a staging build and upload it to the server _first_. This will help eliminate any mistakes; it's the entire point of the staging environment.

In the root directory of the project, run the appropriate of the following commands in a command prompt/terminal:

### Build for staging:
`npm run build:staging`

### Build for Prod:
`npm run build:prod`

This will generate compiled source files in the `/dist/staging/` or `/dist/prod/` directory, depending on which build you ran. 

The items in your respective `/site/` directory should all be uploaded to the root directory for your target environment. For example, all `/dist/staging/site/` items should be uploaded to the root directory for `staging.pawsforabeer.com`.

The items in your respective `/asset/` directory should all be uploaded to the root directory for the target environment's asset root. For example, all `/dist/prod/asset/` items should be uploaded to the root directory for `asset.pawsforabeer.com`.

### Build and Dev Server Arguments

By default when building, the generator-base project will look in its parent directory (`../`) for a `settings.json` file. It will also consider this directory the `resourcesRoot` for the project from where all settings paths will be read relative to.

To change either the resources root directory or the settings file name, you can call any of the server or build commands and append the following:

`-- --env.resourcesRoot=[newDirectoryPath] --env.settings=[youSettingsFilename]`
- `env.resourcesRoot` - `Required` - will use whatever other path you've specified (relative to the root of the lm-generator-base project folder) as the root directory in which to look for the settings file and the new relative root for filepaths read from the settings file.
- `env.settings` - `Optional` - Default: `settings.json` - will use whatever filename you specify as the new name of the settings file.

Example commands using these overrides:

This command uses '../../mySiteResources' as the new resources root directory, and 'otherSettings.json' as the new settings file name when running the local dev server:

`npm start -- --env.resourcesRoot=../../mySiteResources --settings=otherSettings.json`

This command uses '../coolResources' as the new resources root directory, and 'myConfig.json' as the new settings file name when building for staging:

`npm start -- --env.resourcesRoot=../coolResources --settings=myConfig.json`

Neither of these `env` options are required, and you can use one, either, or both. Unless you have a good reason for moving the settings file or resources directory, though, it is advised that you simply use the project defaults.

## Resources and Settings

Read the `site-config.README.md` file for information on how to configure your site. This is critical to understanding how to get a site off the ground effectively.

## Image Creation

Responsive image support:

Breakpoints are at the following size ranges:

 - "xs": 000px -> 480px
 - "sm": 481px -> 768px
 - "md": 769px -> 992px
 - "lg": 993px -> 1200px
 - "xl": 1201px -> up

When authoring images, don't make an image wider than the maximum size for it's size. For instance, an image intended for mobile should never be larger than 480px wide. Since this is responsive design, the heigh is irrelevant - only widths matter.

## Fonts

Font usage in this project is fairly robust. Webfonts will be generated dynamically from the `font` key defined in the settings.json file, and other fonts can be loaded from both local resources as well as remote urls.

For configuration of fonts, see the `site-config.README.md` file.

### Overriding codepoints

Codepoints define what glyph is assigned to what numeric value in a font. By creating a `codepoints.js` file and placing it in the `src` directory for the defined font alongside all of the svg vector files, you can override the project defaults and specify your own values for any codepoints that you want. See the `codepoints.js.example` file in the `siteIcon` font in the `resources-example` directory for more.

## .htaccess

Presently an `.htaccess` file is required to build the project. Add one to the resources directory and point to it via the config.server.htaccess property as a path relative to the root of the resources directory.