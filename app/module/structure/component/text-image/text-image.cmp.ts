import {Component, Inject} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {App_Const, Asset_Svc, GlobalEvent_Svc} from '../../../site-common/';
import {StructureBase_Cmp} from '../../';

@Component({
	selector: 'text-image',
	template: require('./text-image.cmp.html'),
	styles: [require('./text-image.cmp.scss')]
})
export class TextImage_Cmp extends StructureBase_Cmp {
	constructor(protected sanitizer: DomSanitizer,
	            @Inject(App_Const) protected constants,
	            protected assetSvc: Asset_Svc,
	            protected globalEventSvc: GlobalEvent_Svc) {
		super(sanitizer, constants, assetSvc, globalEventSvc);
	}
}