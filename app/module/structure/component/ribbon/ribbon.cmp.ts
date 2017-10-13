import { Component, Inject, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { App_Const, Asset_Svc, GlobalEvent_Svc, GoogleMapsConfig_Mdl, GoogleMap_Svc, Localization_Svc } from 'lm/site-common';
import { StructureBase_Cmp } from 'lm/structure';

@Component({
	selector: 'ribbon',
	template: require('./ribbon.cmp.html'),
	styles: [require('./ribbon.cmp.scss')]
})
export class Ribbon_Cmp extends StructureBase_Cmp{
	private iframeSrc:SafeResourceUrl;
	private hasMap:boolean = false;
	private hasIframe:boolean = false;
	//View child contains the rendered content for the structure
	@ViewChild('mapEl', {read: ViewContainerRef}) mapEl: ViewContainerRef;

	constructor(protected sanitizer: DomSanitizer,
	            @Inject(App_Const) protected constants,
	            protected assetSvc: Asset_Svc,
	            protected globalEventSvc: GlobalEvent_Svc,
				private googleMapSvc:GoogleMap_Svc,
				protected locSvc: Localization_Svc) {
		super(sanitizer, constants, assetSvc, globalEventSvc, locSvc);
	}

	public setConfig(config) {
		super.setConfig(config);
		this.hasMap = !!(this.content && this.content.map);
		this.hasIframe = !!(this.content && this.content.iframe);

		if (this.hasMap) {
			window.setTimeout(() => {
				this.googleMapSvc.initMap(new GoogleMapsConfig_Mdl(this.mapEl, this.content.map));
			}, 0);
		}
		if (this.hasIframe) {
			this.setIframeSrc();
		}
	}

	private setIframeSrc() {
		this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.content.iframe);
	}
}