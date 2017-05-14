import { Component, Inject, Input, OnChanges } from '@angular/core';

import { App_Const, Asset_Svc } from '../../';

@Component({
	selector: 'logo',
	template: require('./logo.cmp.html'),
	styles: [require('./logo.cmp.scss')]
})
export class Logo_Cmp implements OnChanges {
	type: string;
	content: any = {};
	logoSrc: string = '';
	logoTypes: any = {};

	@Input() config: any;

	constructor(private assetSvc: Asset_Svc,
				@Inject(App_Const) private constants) {
		this.logoTypes = constants.logoTypes;
	}

	ngOnChanges() {
		if (this.config && this.config.type === this.constants.logoTypes.image) {
			this.logoSrc = this.assetSvc.getAssetUrl(this.config.content);
		}
	}
}