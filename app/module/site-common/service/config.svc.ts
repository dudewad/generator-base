import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class Config_Svc {
	configUpdatedEvent: BehaviorSubject<any> = new BehaviorSubject<any>({});

	private configs:any = {};

	constructor() {
	}

	setConfig(type, config:any) {
		this.configs[type] = config;
		this.configUpdatedEvent.next({
			type,
			config: this.configs[type]
		});
	}

	getConfig(type):any {
		return this.configs[type];
	}
}