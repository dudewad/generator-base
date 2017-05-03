import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class Config_Svc {
	configUpdatedEvent: BehaviorSubject<any> = new BehaviorSubject<any>({});

	private configs:any = {};
	private configUpdateCallbacks:Array<any> = [];

	setConfig(type, config:any) {
		this.configs[type] = config;
		for(let i = 0, len = this.configUpdateCallbacks.length; i < len; i++){
			(this.configUpdateCallbacks[i].fn)(type, this.configs[type]);
		}
		this.configUpdatedEvent.next({
			type,
			config: this.configs[type]
		});
	}

	getConfig(type):any {
		return this.configs[type];
	}

	private clearUpdateListener(id) {
		for (let i = 0, len = this.configUpdateCallbacks.length; i < len; i++) {
			let callback = this.configUpdateCallbacks[i];
			if(callback.id === id){
				this.configUpdateCallbacks.splice(i, 1);
				break;
			}
		}
	}
}