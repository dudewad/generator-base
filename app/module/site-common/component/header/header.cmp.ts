import { Component, ViewEncapsulation, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {App_Const, Config_Svc, LocalizableContent_Mdl, Localization_Svc } from '../../';

@Component({
	selector: 'site-header',
	template: require('./header.cmp.html'),
	styles: [require('./header.cmp.scss')],
	encapsulation: ViewEncapsulation.None
})

export class Header_Cmp implements OnDestroy, OnInit{
	private content:  any = {};

	private localizableContentObj: LocalizableContent_Mdl;
	private config: any;
	private configSvcSub: Subscription;
	private state: any = {
		mainMenu: {
			enabled: true
		}
	};

	constructor(private configSvc: Config_Svc,
	            private localizationSvc: Localization_Svc,
	            @Inject(App_Const) private constants) {
	}

	private onConfigChange(type, config) {
		if(type === this.constants.configTypes.global) {
			this.config = config.component.header;
			this.localizableContentObj = this.localizationSvc.registerContent(this.config.content);
			this.content = this.localizableContentObj.content;
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
		this.localizableContentObj.unregister();
	}
}