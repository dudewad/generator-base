import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Config_Svc, LocalizableContent_Mdl, Localization_Svc } from 'lm/site-common';

@Component({
	selector: 'site-header',
	template: require('./header.cmp.html'),
	styles: [require('./header.cmp.scss')],
	encapsulation: ViewEncapsulation.None
})

export class Header_Cmp implements OnDestroy{
	content: any = {};

	private localizableContentObj: LocalizableContent_Mdl;
	private config: any;
	private configSvcSub: Subscription;

	constructor(private configSvc: Config_Svc,
	            private localizationSvc: Localization_Svc) {
		this.configSvcSub = this.configSvc.globalConfigUpdate
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