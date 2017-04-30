import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { LocalizableContent_Mdl } from '../';
import { Config_Svc } from './';

@Injectable()
export class Localization_Svc {
	localeChangeEvent: Subject<string> = new Subject<string>();

	private locale: string = "en_us";
	private localizableContentItems: Array<LocalizableContent_Mdl> = [];

	constructor(private configSvc: Config_Svc){
		let body = document.getElementsByTagName("body")[0];
		body.onclick = () => {
			this.setLocale(this.locale === 'en_us' ? 'es_ar' : 'en_us');
		}

	}

	setLocale(locale: string) {
		this.locale = locale;
		this.localizableContentItems.forEach(el => {
			el.setLocale(locale);
		});
		this.localeChangeEvent.next(locale);
	}

	getLocale() {
		return this.locale;
	}

	registerContent(content: any) {
		let locItem = new LocalizableContent_Mdl(content, this.locale, this.unregisterContent);

		this.localizableContentItems.push(locItem);
		return locItem;
	}

	private unregisterContent(content: LocalizableContent_Mdl) {

	}
}