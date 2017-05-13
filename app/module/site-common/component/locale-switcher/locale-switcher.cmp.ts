import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Config_Svc, App_Const, LocalizableContent_Mdl, Localization_Svc } from "../../";

@Component({
	selector: 'locale-switcher',
	template: require('./locale-switcher.cmp.html'),
	styles: [require('./locale-switcher.cmp.scss')]
})
export class LocaleSwitcher_Cmp implements OnInit {
	locale: any;
	locales: Array<any> = [];
	active: boolean = false;
	content: any = {};

	private localizableContentObj: LocalizableContent_Mdl;
	private config: any;
	private configSvcSub: Subscription;

	constructor(private configSvc: Config_Svc,
	            private localizationSvc: Localization_Svc,
	            @Inject(App_Const) protected constants) {
		this.locale = localizationSvc.getCurrentLocale();
		this.localizationSvc.localeUpdatedEvent.subscribe(locale => {
			this.locale = locale;
			this.locales = this.localizationSvc.getLocales();
		});
	}

	ngOnInit() {
		this.configSvcSub = this.configSvc.configUpdatedEvent
			.filter(data => data.type === this.constants.configTypes.global)
			.subscribe(data => {
				this.onConfigChange(data.config);
			});
	}

	toggle() {
		this.active = !this.active;
	}

	handleLocaleClick(locale:any) {
		this.localizationSvc.setLocale(locale.locale);
		this.toggle();
	}

	private onConfigChange(config) {
		this.config = config.component.localeSwitcher;
		this.localizableContentObj && this.localizableContentObj.unregister();
		this.localizableContentObj = this.localizationSvc.registerContent(this.config.content);
		this.content = this.localizableContentObj.content;
	}
}