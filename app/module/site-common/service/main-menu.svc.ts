import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs'

import { Config_Svc } from './config.svc';

@Injectable()
export class MainMenu_Svc {
	menuStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	menuConfigUpdate: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	menuPageAdded: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	menuPagePopped: BehaviorSubject<any> = new BehaviorSubject<any>([]);

	private bodyRef: HTMLElement;
	private classes: any = {
		bodyActive: 'main-menu-active'
	};
	private configSvcSub: Subscription;
	private mainMenuCfg: any;
	private pages: Array<any> = [];

	constructor(private configSvc: Config_Svc){
		this.bodyRef = document.getElementsByTagName('body')[0];

		this.configSvcSub = this.configSvc.globalConfigUpdate
			.subscribe(data => {
				this.onConfigUpdate(data.config);
			});
	}

	toggle(active?: boolean) {
		if (typeof active === 'undefined') {
			active = !this.menuStatus.getValue();
		}
		MainMenu_Svc.toggleClass(this.bodyRef, this.classes.bodyActive);
		this.menuStatus.next(active);

		if (!active) {
			while (this.pages.length > 1) {
				this.popPage();
			}
		}
	}

	addPage(page: any) {
		if (page.active) {
			return;
		}

		page.active = true;
		if (!this.pages.length) {
			page.isRoot = true;
		}
		this.pages.push(page);
		this.menuPageAdded.next(this.pages);
	}

	popPage(closeIfRoot: boolean = false) {
		if (this.pages.length === 1) {
			if (closeIfRoot) {
				this.toggle(false);
			}
			return;
		}
		this.pages.pop().active = false;
		this.menuPagePopped.next(this.pages);
	}

	private onConfigUpdate(data: any) {
		this.mainMenuCfg = (data && data.component && data.component.mainMenu) || {};
		this.menuConfigUpdate.next(this.mainMenuCfg);
	}

	private static toggleClass(el: HTMLElement, className: string) {
		let classes = el.className.split(' ');
		let classIndex = classes.indexOf(className);

		if (classIndex > -1) {
			classes.splice(classIndex, 1);
		}
		else {
			classes.push(className);
		}

		el.className = classes.join(' ');
	}
}