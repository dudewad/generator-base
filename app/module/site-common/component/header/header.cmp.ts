import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Config_Svc, App_Const } from '../../';

@Component({
	selector: 'site-header',
	template: require('./header.cmp.html'),
	styles: [require('./header.cmp.scss')]
})

export class Header_Cmp implements OnDestroy, OnInit{
	private config: any;
	private configSvcSub: Subscription;
	private content:  any = {};
	private state: any = {
		mainMenu: {
			enabled: true
		}
	};

	constructor(private configSvc: Config_Svc,
	            @Inject(App_Const) private constants) {
	}

	private onConfigChange(type, config) {
		if(type === this.constants.configTypes.global) {
			this.config = config.component.header;
			this.content = config.component.header.content;
		}
	}

	ngOnInit() {
		this.config = this.configSvc.getConfig(this.constants.configTypes.global);
		this.configSvcSub = this.configSvc.configUpdatedEvent.subscribe(data => {
			this.onConfigChange(data.type, data.config);
		});
	}

	ngOnDestroy() {
		this.configSvcSub.unsubscribe();
	}
}