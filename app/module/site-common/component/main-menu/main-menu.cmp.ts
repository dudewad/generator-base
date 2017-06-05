import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'

import { Config_Svc, ConfigTypes, MainMenu_Svc } from 'lm/site-common';

@Component({
	selector: 'main-menu',
	template: require('./main-menu.cmp.html'),
	styles: [require('./main-menu.cmp.scss')]
})

export class MainMenu_Cmp implements OnDestroy{
	state: any = {
		active: false
	};

	private menuStatusSub: Subscription;
	private configSvcSub: Subscription;

	constructor(private configSvc: Config_Svc,
	            private mainMenuSvc: MainMenu_Svc) {
		this.menuStatusSub = mainMenuSvc.menuStatus.subscribe(active => {
			this.state.active = active;
		});

		this.onConfigChange(configSvc.getConfig(ConfigTypes.global));
		this.configSvcSub = this.configSvc.configUpdatedEvent
			.filter(data => data.type === ConfigTypes.global)
			.subscribe(data => {
				this.onConfigChange(data.config);
			});
	}

	ngOnDestroy() {
		this.menuStatusSub.unsubscribe();
	}

	onConfigChange(cfg) {

	}

	clickH() {
		this.mainMenuSvc.toggle(false);
	}
}