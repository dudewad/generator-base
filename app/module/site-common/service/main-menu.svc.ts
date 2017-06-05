import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class MainMenu_Svc {
	menuStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private bodyRef: HTMLElement;
	private classes: any = {
		bodyActive: 'main-menu-active'
	};

	constructor(){
		this.bodyRef = document.getElementsByTagName('body')[0];
	}

	toggle(active?: boolean) {
		if(typeof active === 'undefined') {
			active = !this.menuStatus.getValue();
		}
		this.toggleClass(this.bodyRef, this.classes.bodyActive);
		this.menuStatus.next(active);
	}

	private toggleClass(el: HTMLElement, className: string) {
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