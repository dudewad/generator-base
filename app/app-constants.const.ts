var $ = require("jquery");

let consts = {
	breakpoint: BREAKPOINT,
	configTypes:{
		app: 'app',
		global: 'global'
	},
	url: {
		contentRoot: CONTENT_ROOT,
		//Root for site page/component structure data (i.e. site definition JSON files)
		dataRoot: DATA_ROOT,
		//This file maps the route paths (routes) to data files for configuration of the site
		config: 'config.json',
		imageRelativePath: IMAGE_RELATIVE_PATH,
		googleMapsImport: 'https://maps.googleapis.com/maps/api/js?key=$$API_KEY$$'
	},
	routeMap: {
		//The key for the route map's "default" option
		routeDataDefaultKey: 'default',
		//A suffix at the end of component names that is consistent across the project. This will allow for more
		//user-friendly names in the routemap files but will require it to be added to the names when parsing them.
		componentExtension: '_Cmp'
	},
	componentConfig: {
		backgroundStyles: {
			image: 'image',
			color: 'color'
		}
	},
	vendor: {
		googleMaps: {
			//Indicates which view type a map is - e.g. map or streetview. Any implemented types should be registered here
			viewType: {
				map: 'map',
				streetview: 'streetview'
			}
		}
	}
};

export const Constants = consts;