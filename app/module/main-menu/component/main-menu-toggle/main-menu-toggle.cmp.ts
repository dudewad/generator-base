import { Component, HostListener } from '@angular/core';

import { MainMenu_Svc } from "../../";

@Component({
	selector: 'main-menu-toggle',
	template: require('./main-menu-toggle.cmp.html'),
	styles: [require('./main-menu-toggle.cmp.scss')]
})
export class MainMenuToggle_Cmp {
	constructor(private mainMenuSvc: MainMenu_Svc) {
	}

	@HostListener('click', ['$event']) handleClick(event) {
		this.mainMenuSvc.toggle();
	}
}