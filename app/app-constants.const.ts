let consts = {
	breakpoint: BREAKPOINT,
	url: {
		contentRoot: CONTENT_ROOT,
		//Root for site page/component structure data (i.e. site definition JSON files)
		dataRoot: DATA_ROOT,
		//This file maps the route paths (routes) to data files for configuration of the site
		config: 'config.json',
		imageRelativePath: IMAGE_RELATIVE_PATH
	},
	routeMap: {
		//The key for the route map's "default" option
		routeDataDefaultKey: 'default',
		//A suffix at the end of component names that is consistent across the project. This will allow for more
		//user-friendly names in the routemap files but will require it to be added to the names when parsing them.
		componentExtension: '_Cmp'
	}
};

export const Constants = consts;