import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StorageService } from './opaque-tokens';
import { StorageService_Fac } from './factory';
import { MainMenu_Mod } from '../main-menu';

import { Footer_Cmp, Header_Cmp, LocaleSwitcher_Cmp, Logo_Cmp } from './component';
import { Asset_Svc, Config_Svc, Localization_Svc } from "./service";

@NgModule({
	declarations: [
		Footer_Cmp,
		Header_Cmp,
		LocaleSwitcher_Cmp,
		Logo_Cmp
	],
	imports: [
		CommonModule,
		MainMenu_Mod,
		RouterModule
	],
	exports: [
		Footer_Cmp,
		Header_Cmp
	],
	providers: [
		Asset_Svc,
		Config_Svc,
		Localization_Svc,
		{
			provide: StorageService,
			useFactory: StorageService_Fac,
			deps: []
		},
	]
})

export class SiteCommon_Mod {
}