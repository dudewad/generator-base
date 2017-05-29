import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { Config_Svc, ConfigTypes, LocalizableContent_Mdl, Localization_Svc } from "../../";

@Component({
	selector: 'locale-switcher',
	template: require('./locale-switcher.cmp.html'),
	styles: [require('./locale-switcher.cmp.scss')]
})
export class LocaleSwitcher_Cmp {
	locale: any;
	locales: Array<any> = [];
	active: boolean = false;
	content: any = {};

	private localizableContentObj: LocalizableContent_Mdl;
	private config: any;
	private configSvcSub: Subscription;

	constructor(private configSvc: Config_Svc,
	            private localizationSvc: Localization_Svc) {
		this.locale = localizationSvc.getCurrentLocale();
		this.localizationSvc.localeUpdatedEvent.subscribe(locale => {
			this.locale = locale;
			this.locales = this.localizationSvc.getLocales();
		});
		this.onConfigChange(configSvc.getConfig(ConfigTypes.global));
		this.configSvcSub = this.configSvc.configUpdatedEvent
			.filter(data => data.type === ConfigTypes.global)
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
		if (!config) {
			return;
		}
		this.config = config.component.localeSwitcher;
		this.localizableContentObj && this.localizableContentObj.unregister();
		this.localizableContentObj = this.localizationSvc.registerContent(this.config.content);
		this.content = this.localizableContentObj.content;
	}
}