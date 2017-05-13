import {Component} from '@angular/core';

import { Config_Svc } from '../../';

@Component({
	selector: 'logo',
	template: require('./logo.cmp.html'),
	styles: [require('./logo.cmp.scss')]
})
export class Logo_Cmp {
	type: string;

	constructor(private configSvc: Config_Svc) {
		this.configSvc.configUpdatedEvent
			.filter(data => true)
			.subscribe(data => {

			})
	}
}