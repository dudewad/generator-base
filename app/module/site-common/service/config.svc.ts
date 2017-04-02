import {Injectable} from '@angular/core';

@Injectable()
export class Config_Svc {
	private configs:any = {};
	private configUpdateCallbacks:Array<any> = [];

	setConfig(type, config:any) {
		this.configs[type] = config;
		for(let i = 0, len = this.configUpdateCallbacks.length; i < len; i++){
			(this.configUpdateCallbacks[i].fn)(type, this.configs[type]);
		}
	}

	getConfig(type):any {
		return this.configs[type];
	}

	onConfigUpdate(fn) {
		let that = this;
		let id = this.configUpdateCallbacks.length;

		this.configUpdateCallbacks.push({fn, id});
		return function() {
			that.clearUpdateListener(id);
		}
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