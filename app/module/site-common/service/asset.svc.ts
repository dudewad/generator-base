import {Inject, Injectable} from '@angular/core';

import {App_Const} from '../';

@Injectable()
export class Asset_Svc {
	constructor(@Inject(App_Const) protected constants) {
	}

	getAssetUrl(filename) {
		return `${this.constants.url.contentRoot}${this.constants.url.imageRelativePath}${filename}`;
	}
}