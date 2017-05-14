import { Component, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {App_Const, Config_Svc, LocalizableContent_Mdl, Localization_Svc } from '../../';

@Component({
	selector: 'site-header',
	template: require('./header.cmp.html'),
	styles: [require('./header.cmp.scss')],
	encapsulation: ViewEncapsulation.None
})

export class Header_Cmp implements OnDestroy{
	content: any = {};
	state: any = {
		mainMenu: true
	};

	private localizableContentObj: LocalizableContent_Mdl;
	private config: any;
	private configSvcSub: Subscription;

	constructor(private configSvc: Config_Svc,
	            private localizationSvc: Localization_Svc,
	            @Inject(App_Const) private constants) {
		this.onConfigChange(configSvc.getConfig(constants.configTypes.global));
		this.configSvcSub = this.configSvc.configUpdatedEvent
			.filter(data => data.type === this.constants.configTypes.global)
			.subscribe(data => {
				this.onConfigChange(data.config);
			});
	}

	ngOnDestroy() {
		this.configSvcSub.unsubscribe();
		this.localizableContentObj && this.localizableContentObj.unregister();
	}

	private onConfigChange(config) {
		if (!config) {
			return;
		}
		this.config = config.component.header;
		this.localizableContentObj && this.localizableContentObj.unregister();
		this.localizableContentObj = this.localizationSvc.registerContent(this.config.content);
		this.content = this.localizableContentObj.content;
	}
}