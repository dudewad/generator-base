import { Component, Input } from '@angular/core';

import { MainMenu_Svc } from "lm/site-common";

export const MainMenuItemStyles: any = {
	link: 'link',
	button: 'button'
};

@Component({
	selector: 'main-menu-page',
	template: require('./main-menu-page.cmp.html'),
	styles: [require('./main-menu-page.cmp.scss')]
})
export class MainMenuPage_Cmp {
	@Input('content') page:any;
	itemStyles: any = MainMenuItemStyles;

	constructor(private mainMenuSvc: MainMenu_Svc) {
	}

	ngOnInit() {
	}

	handleLinkClick(item: any) {
		this.closeMenu();
	}

	closeMenu() {
		this.mainMenuSvc.toggle(false);
	}

	openMenuPage(page: any) {
		this.mainMenuSvc.addPage(page);
	}

	popPage() {
		this.mainMenuSvc.popPage(true);
	}
}