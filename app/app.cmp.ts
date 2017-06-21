import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';

import { App_Const } from './module/site-common';
import { Config_Svc, ConfigTypes, Metrics_Svc } from './module/site-common';

@Component({
	selector: 'app-main',
	template: require('./app.cmp.html'),
	styles: [require('./app.scss')],
	encapsulation: ViewEncapsulation.None
})
export class App_Cmp implements OnInit{
	state:any = {
		mainMenu: false,
		header: false,
		footer: false
	};

	constructor(private configSvc: Config_Svc,
				private http: Http,
	            private metricsSvc: Metrics_Svc,
	            @Inject(App_Const) private constants){
		this.configSvc.pageConfigUpdate
			.subscribe(data => {
				if (!data.config) {
					return;
				}

				let cfg = data.config.config;
				this.state.header = cfg.header;
				this.state.footer = cfg.footer;
				this.state.mainMenu = cfg.mainMenu;
			});
	}

	ngOnInit() {
		let configUrl = this.constants.url.dataRoot + this.constants.url.config;

		this.http.get(configUrl)
			.map(res => res.json())
			.subscribe(result => {
					this.loadGlobalConfig(this.constants.url.dataRoot + result['globalConfig']);
					this.configSvc.setConfig(ConfigTypes.app, result);
					if (result.vendor.metrics) {
						this.metricsSvc.init(result.vendor.metrics);
					}
				},
				error => {
					//TODO: Don't throw an error, catch it and redirect to a 404/"omg its broken" page.
					throw new Error(`Critical error - could not load site route map. The resource '${configUrl}' could not be found.`);
				});
	}

	private loadGlobalConfig(url){
		this.http.get(url)
			.map(res => res.json())
			.subscribe(result => {
				this.configSvc.setConfig(ConfigTypes.global, result);
			},
			error => {

			});
	}
}