import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { App_Const, Config_Svc, ConfigTypes } from 'lm/site-common';
import { PageConfig_Mdl, Renderer_Svc } from 'lm/structure';

@Component({
	selector: 'structure',
	template: require('./structure-builder.cmp.html'),
	styles: [require('./structure-builder.cmp.scss')],
	encapsulation: ViewEncapsulation.None
})
export class StructureBuilder_Cmp implements OnInit, OnDestroy {
	private routerEventSub: Subscription;
	//Once loaded, will contain the mapping of site routes/paths to json files
	private config: any;
	//Routes called before the routeMap has loaded will be stored here.
	private currentRoute: any;
	private configSvcSub: Subscription;
	private body: any = document.getElementsByTagName("body")[0];
	//View child contains the rendered content for the structure
	@ViewChild('structure', {read: ViewContainerRef}) structureContainer: ViewContainerRef;

	constructor(private configSvc:Config_Svc,
				private router: Router,
	            private http: Http,
	            private renderer: Renderer_Svc,
				@Inject(App_Const) private constants) {
	}

	ngOnInit() {
		this.configSvcSub = this.configSvc.appConfigUpdate.subscribe(data => {
			this.onConfigChange(data.config);
		});

		this.routerEventSub = this.router.events
			.filter(evt => evt instanceof NavigationEnd)
			.subscribe(evt => {
				this.onNavigationEnd(evt);
			});
	}

	/**
	 * Retrieve page-specific configuration JSON files.
	 *
	 * @param path
	 */
	private getPageData(path: string) {
		let url = this.constants.url.dataRoot;
		let routes = this.config.routes;
		let defaultKey = this.constants.routeMap.routeDataDefaultKey;

		path = path[0] === '/' ? path : '/' + path;
		if(routes.hasOwnProperty(path)){
			url += routes[path];
		}
		else if(routes.hasOwnProperty(defaultKey)){
			console.warn(`Falling back to default page for path ${path}`);
			url += routes[defaultKey];
		}
		else{
			//TODO: No default and no recognized path. Bail/404 instead of erroring out
			throw new Error(`No matching page found for route path ${path}`);
		}

		this.http.get(url)
			.map(res => res.json())
			.subscribe(result => {
					this.onPageConfigChange(result)
				},
				error => {
					//TODO: Redirect to 404
					console.warn(`Error retrieving page JSON file for ${url}. The file does not exist.`);
				});
	}

	/**
	 * When page navigation completes, we need to parse the current path to request the new page configuration file.
	 *
	 * @param route
	 */
	private onNavigationEnd(route: any) {
		//Without routeMap loaded, we can't match routes to data files. Set it to pending.
		if(!this.config) {
			this.currentRoute = route;
			return;
		}

		let path:string = route.url;
		if(route.url[0] === '/'){
			path = route.url.substring(1);
		}

		this.currentRoute = route;
		this.getPageData(path);
	}

	/**
	 * Handler for when a config loads/is changed
	 *
	 * @param config
	 */
	private onConfigChange(config) {
		this.config = config;
		this.onNavigationEnd(this.currentRoute);
	}

	/**
	 * Handler for when page config files get loaded
	 *
	 * @param config
	 */
	private onPageConfigChange(config:any){
		let conf = new PageConfig_Mdl(config);
		this.renderer.clearPage(this.structureContainer);
		this.renderer.renderPage(conf, this.structureContainer);
		this.body.scrollTop = 0;
		this.configSvc.setConfig(ConfigTypes.page, config, this.currentRoute);
	}

	ngOnDestroy() {
		this.routerEventSub.unsubscribe();
		this.configSvcSub.unsubscribe();
	}
}