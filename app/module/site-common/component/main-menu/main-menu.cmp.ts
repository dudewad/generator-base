import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs'

import {LocalizableContent_Mdl, Localization_Svc, MainMenu_Svc} from 'lm/site-common';

@Component({
	selector: 'main-menu',
	template: require('./main-menu.cmp.html'),
	styles: [require('./main-menu.cmp.scss')]
})

export class MainMenu_Cmp implements OnDestroy{
	config: any = {};
	localizableContentMdl: LocalizableContent_Mdl;
	state: any = {
		active: false
	};
	pages: Array<any> = [];
	@ViewChild('menuContent') menuContent: ElementRef;

	private menuConfigUpdate: Subscription;
	private menuStatusSub: Subscription;
	private pageAddedSub: Subscription;
	private pagePoppedSub: Subscription;

	constructor(private locSvc: Localization_Svc,
	            private mainMenuSvc: MainMenu_Svc) {
		this.menuStatusSub = mainMenuSvc.menuStatus
			.subscribe(active => {
				this.state.active = active;
			});

		this.menuConfigUpdate = this.mainMenuSvc.menuConfigUpdate
			.subscribe(data => {
				this.onConfigUpdate(data);
			});

		this.pagePoppedSub = this.mainMenuSvc.menuPagePopped
			.subscribe(pagesArr => {
				this.pages = pagesArr;
			});

		this.pageAddedSub = this.mainMenuSvc.menuPageAdded
			.subscribe(pagesArr => {
				this.pages = pagesArr;
			});
	}

	ngOnDestroy() {
		this.menuConfigUpdate.unsubscribe();
		this.menuStatusSub.unsubscribe();
	}

	onConfigUpdate(cfg: any) {
		this.config = cfg;
		this.localizableContentMdl && this.localizableContentMdl.unregister();
		this.localizableContentMdl = this.locSvc.registerContent(cfg.content);
		this.mainMenuSvc.addPage(this.localizableContentMdl.content);
	}

	handleBackdropClick() {
		this.mainMenuSvc.toggle(false);
	}
}