import { Component, Input, OnChanges } from '@angular/core';

import { Asset_Svc } from 'lm/site-common';

export const LogoTypes: any = {
	image: 'image',
	icon: 'icon',
	text: 'text'
};

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

	constructor(private assetSvc: Asset_Svc) {
		this.logoTypes = LogoTypes;
	}

	ngOnChanges() {
		if (this.config && this.config.type === this.logoTypes.image) {
			this.logoSrc = this.assetSvc.getAssetUrl(this.config.content);
		}
	}
}