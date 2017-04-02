import {Component, Inject, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

import {App_Const, Asset_Svc, GlobalEvent_Svc, GoogleMapsConfig_Mdl, GoogleMap_Svc} from '../../../site-common/';
import {StructureBase_Cmp} from '../../';

@Component({
	selector: 'ribbon',
	template: require('./ribbon.cmp.html'),
	styles: [require('./ribbon.cmp.scss')]
})
export class Ribbon_Cmp extends StructureBase_Cmp implements OnDestroy{
	private iframeSrc:SafeResourceUrl;
	private hasMap:boolean = false;
	private hasIframe:boolean = false;
	//View child contains the rendered content for the structure
	@ViewChild('mapEl', {read: ViewContainerRef}) mapEl: ViewContainerRef;

	constructor(protected sanitizer: DomSanitizer,
	            @Inject(App_Const) protected constants,
	            protected assetSvc: Asset_Svc,
	            protected globalEventSvc: GlobalEvent_Svc,
				private googleMapSvc:GoogleMap_Svc) {
		super(sanitizer, constants, assetSvc, globalEventSvc);
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

	ngOnDestroy() {

	}
}