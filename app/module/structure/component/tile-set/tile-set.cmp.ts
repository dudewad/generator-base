import { Component, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { App_Const, Asset_Svc, GlobalEvent_Svc, Localization_Svc } from 'lm/site-common';
import { StructureBase_Cmp } from 'lm/structure';

@Component({
	selector: 'tile-set',
	template: require('./tile-set.cmp.html'),
	styles: [require('./tile-set.cmp.scss')]
})
export class TileSet_Cmp extends StructureBase_Cmp{
	constructor(protected sanitizer: DomSanitizer,
	            @Inject(App_Const) protected constants,
	            protected assetSvc: Asset_Svc,
	            protected globalEventSvc: GlobalEvent_Svc,
	            protected locSvc: Localization_Svc) {
		super(sanitizer, constants, assetSvc, globalEventSvc, locSvc);
	}
}