import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class MainMenu_Svc {
	menuStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(){
	}

	toggle(active?: boolean) {
		if(typeof active === 'undefined') {
			active = !this.menuStatus.getValue();
		}
		this.menuStatus.next(active);
	}
}