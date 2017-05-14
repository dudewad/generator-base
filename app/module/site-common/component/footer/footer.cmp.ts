import { Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { App_Const, Config_Svc, LocalizableContent_Mdl, Localization_Svc } from "../../";

@Component({
	selector: 'site-footer',
	template: require('./footer.cmp.html'),
	styles: [require('./footer.cmp.scss')],
	encapsulation: ViewEncapsulation.None
})

export class Footer_Cmp implements OnDestroy {
	content: any = {};

	private config: any;
	private configSvcSub: Subscription;
	private localizableContentObj: LocalizableContent_Mdl;

	constructor(private configSvc: Config_Svc,
	            private localizationSvc: Localization_Svc,
	            private sanitizer: DomSanitizer,
	            @Inject(App_Const) private constants) {
		this.onConfigChange(configSvc.getConfig('global'));
		this.configSvcSub = this.configSvc.configUpdatedEvent
			.filter(data => data.type === this.constants.configTypes.global)
			.subscribe(data => {
				this.onConfigChange(data.config)
			});
	}

	ngOnDestroy() {
		this.configSvcSub.unsubscribe();
		this.localizableContentObj && this.localizableContentObj.unregister();
	}

	getSanHtml(str) {
		return this.sanitizer.bypassSecurityTrustHtml(str);
	}

	getDate() {
		return new Date().getFullYear();
	}

	private onConfigChange(config) {
		if (!config) {
			return;
		}
		this.config = config.component.footer;
		this.localizableContentObj && this.localizableContentObj.unregister();
		this.localizableContentObj = this.localizationSvc.registerContent(this.config.content);
		this.content = this.localizableContentObj.content;
	}
}