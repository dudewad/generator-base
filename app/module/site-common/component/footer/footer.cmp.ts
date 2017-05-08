import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { App_Const, Config_Svc, LocalizableContent_Mdl, Localization_Svc } from "../../";

@Component({
	selector: 'site-footer',
	template: require('./footer.cmp.html'),
	styles: [require('./footer.cmp.scss')],
	encapsulation: ViewEncapsulation.None
})

export class Footer_Cmp implements OnInit, OnDestroy {
	content: any = {};

	private config: any;
	private configSvcSub: Subscription;
	private localizableContentObj: LocalizableContent_Mdl;

	constructor(private configSvc: Config_Svc,
	            private localizationSvc: Localization_Svc,
	            private sanitizer: DomSanitizer,
	            @Inject(App_Const) private constants) {
	}

	public getSanHtml(str) {
		return this.sanitizer.bypassSecurityTrustHtml(str);
	}

	private onConfigChange(type, config) {
		if (type === this.constants.configTypes.global) {
			this.config = config.component.footer;
			this.localizableContentObj = this.localizationSvc.registerContent(this.config.content);
			this.content = this.localizableContentObj.content;
		}
	}

	ngOnInit() {
		this.config = this.configSvc.getConfig(this.constants.configTypes.global);
		this.configSvcSub = this.configSvc.configUpdatedEvent.subscribe(data => {
			this.onConfigChange(data.type, data.config)
		});
	}

	ngOnDestroy() {
		this.configSvcSub.unsubscribe();
		this.localizableContentObj.unregister();
	}

	getDate() {
		return new Date().getFullYear();
	}
}