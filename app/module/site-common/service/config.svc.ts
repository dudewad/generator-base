import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const ConfigTypes: any = {
	app: 'app',
	global: 'global',
	page: 'page'
};

@Injectable()
export class Config_Svc {
	configUpdatedEvent: BehaviorSubject<any> = new BehaviorSubject<any>({});

	private configs:any = {};

	constructor() {
	}

	setConfig(type, config:any, currentRoute?: any) {
		this.configs[type] = config;
		this.configUpdatedEvent.next({
			type,
			config: this.configs[type],
			currentRoute
		});
	}

	getConfig(type):any {
		return this.configs[type];
	}
}