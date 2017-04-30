import {Component, Inject} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {App_Const, Asset_Svc, GlobalEvent_Svc, Localization_Svc} from '../../../site-common/';
import {StructureBase_Cmp} from '../../';

@Component({
	selector: 'hero',
	template: require('./hero.cmp.html'),
	styles: [require('./hero.cmp.scss')]
})
export class Hero_Cmp extends StructureBase_Cmp{
	constructor(protected sanitizer: DomSanitizer,
	            @Inject(App_Const) protected constants,
	            protected assetSvc: Asset_Svc,
	            protected globalEventSvc: GlobalEvent_Svc,
	            protected localizationSvc: Localization_Svc) {
		super(sanitizer, constants, assetSvc, globalEventSvc, localizationSvc);
	}
}