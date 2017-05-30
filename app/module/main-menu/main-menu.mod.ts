import {NgModule} from '@angular/core';

import {MainMenu_Cmp, MainMenuToggle_Cmp, MainMenu_Svc} from './';

@NgModule({
	declarations: [
		MainMenu_Cmp,
		MainMenuToggle_Cmp
	],
	exports: [
		MainMenu_Cmp,
		MainMenuToggle_Cmp
	],
	providers: [
		MainMenu_Svc
	]
})

export class MainMenu_Mod {
}