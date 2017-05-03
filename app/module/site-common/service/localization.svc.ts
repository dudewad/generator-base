import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import {App_Const, LocalizableContent_Mdl, StorageService } from '../';
import { Config_Svc } from './';

@Injectable()
export class Localization_Svc {
	localeUpdatedEvent: BehaviorSubject<any> = new BehaviorSubject<any>({});

	private currentLocale: any = {};
	private locItems: Array<LocalizableContent_Mdl> = [];
	private storageKey: string = 'locale';
	private locConfig: any = {};
	private configSvcSub: Subscription;
	private cfgTypeApp: string;

	constructor(private configSvc: Config_Svc,
				@Inject(StorageService) private storageService,
				@Inject(App_Const) private constants){
		let appCfg;

		this.cfgTypeApp = this.constants.configTypes.app;
		appCfg = this.configSvc.getConfig(this.cfgTypeApp);
		this.setLocale(this.storageService.get(this.storageKey));

		this.configSvcSub = this.configSvc.configUpdatedEvent
			.filter(data => data.type === this.cfgTypeApp)
			.subscribe(data => {
			this.handleConfigChange(data.config);
		});

		if (appCfg) {
			this.handleConfigChange(appCfg);
		}
	}

	setLocale(locale: string) {
		console.log('setting locale', locale);
		let localeObject = this.getLocaleFromConfig(locale);
		if (!locale || locale === this.currentLocale.name || !localeObject) {
			if(!localeObject) {
				console.warn(`Tried to set locale ${locale}, which is not a registered locale in the config. Aborting.`);
			}
			return;
		}
		this.currentLocale = localeObject;
		this.locItems.forEach(el => {
			el.setLocale(locale);
		});
		this.storageService.set(this.storageKey, localeObject.locale);
		this.localeUpdatedEvent.next(localeObject);
	}

	getCurrentLocale() {
		return this.currentLocale;
	}

	getLocales():Array<string> {
		return this.locConfig.locales;
	}

	registerContent(content: any) {
		let locItem = new LocalizableContent_Mdl(content, this.currentLocale.locale, this.unregisterContent.bind(this));

		this.locItems.push(locItem);
		return locItem;
	}

	private getLocaleFromConfig(locale: string) {
		let locales = this.locConfig && this.locConfig.locales;
		let foundLocale;

		if (locales && Array.isArray(locales)) {
			foundLocale = locales.filter(el => {
				console.log(el, locale);
				return el.locale === locale;
			})[0];
		}
		return foundLocale ? foundLocale : null;
	}

	private handleConfigChange(config: any) {
		this.locConfig = config.localization || {};
		this.setLocale(this.currentLocale && this.currentLocale.locale || this.locConfig.default);
	}

	private unregisterContent(content: LocalizableContent_Mdl) {
		this.locItems.splice(this.locItems.indexOf(content), 1);
	}
}