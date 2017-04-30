import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';

import { App_Const } from './module/site-common';
import { Config_Svc } from './module/site-common';
import { StorageService } from './module/site-common';

@Component({
	selector: 'app-main',
	template: require('./app.cmp.html'),
	styles: [require('./app.scss')],
	encapsulation: ViewEncapsulation.None
})
export class App_Cmp implements OnInit{
	private state:any = {
		header: {
			enabled: true
		},
		footer: {
			enabled: true
		}
	};

	constructor(private configSvc:Config_Svc,
				private http: Http,
	            @Inject(App_Const) private constants,
				@Inject(StorageService) private storageService){

	}

	ngOnInit() {
		let configUrl = this.constants.url.dataRoot + this.constants.url.config;

		this.http.get(configUrl)
			.map(res => res.json())
			.subscribe(result => {
					this.loadGlobalConfig(this.constants.url.dataRoot + result['globalConfig']);
					this.configSvc.setConfig(this.constants.configTypes.app, result);
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
				this.configSvc.setConfig(this.constants.configTypes.global, result);
			},
			error => {

			});
	}
}