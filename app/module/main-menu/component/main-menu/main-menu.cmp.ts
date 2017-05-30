import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'

import { MainMenu_Svc } from '../../';

@Component({
	selector: 'main-menu',
	template: require('./main-menu.cmp.html')
})

export class MainMenu_Cmp implements OnDestroy{
	private menuStatusSub: Subscription;
	private active: boolean = false;

	constructor(mainMenuSvc: MainMenu_Svc) {
		this.menuStatusSub = mainMenuSvc.menuStatus.subscribe(active => {
			this.active = active;
		});
	}

	ngOnDestroy() {
		this.menuStatusSub.unsubscribe();
	}
}