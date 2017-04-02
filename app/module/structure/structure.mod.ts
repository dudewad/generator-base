import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';

import {
	Copy_Cmp,
	DataTable_Cmp,
	Hero_Cmp,
	StructureBuilder_Cmp,
	Ribbon_Cmp,
	TextImage_Cmp,
	TileSet_Cmp
} from './component';
import {Renderer_Svc} from './service';
import {Asset_Svc, GlobalEvent_Svc, GoogleMap_Svc} from "../site-common";

@NgModule({
	declarations: [
		Copy_Cmp,
		DataTable_Cmp,
		Hero_Cmp,
		StructureBuilder_Cmp,
		Ribbon_Cmp,
		TextImage_Cmp,
		TileSet_Cmp
	],
	entryComponents: [
		Copy_Cmp,
		DataTable_Cmp,
		Hero_Cmp,
		Ribbon_Cmp,
		TextImage_Cmp,
		TileSet_Cmp
	],
	exports: [
		StructureBuilder_Cmp
	],
	imports: [
		BrowserModule,
		CommonModule,
		HttpModule,
		RouterModule
	],
	providers: [
		Asset_Svc,
		GlobalEvent_Svc,
		GoogleMap_Svc,
		Renderer_Svc
	]
})

export class Structure_Mod {
}