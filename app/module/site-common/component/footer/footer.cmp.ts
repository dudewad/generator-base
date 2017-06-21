import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Config_Svc, LocalizableContent_Mdl, Localization_Svc } from "lm/site-common";

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
	            private sanitizer: DomSanitizer) {
		this.configSvcSub = this.configSvc.globalConfigUpdate
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