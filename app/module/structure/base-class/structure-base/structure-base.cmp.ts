import {Component, Inject, OnDestroy} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {App_Const, Asset_Svc, GlobalEvent_Svc} from '../../../site-common/';

@Component({})
export abstract class StructureBase_Cmp implements OnDestroy {
	protected config: any = {};
	protected content: any = {};
	private url: any = {};
	private resizeHandlerId: number;
	private win: any = window;
	private bp: any;
	private currBp: string;

	constructor(protected sanitizer: DomSanitizer,
	            @Inject(App_Const) protected constants,
	            //TODO: OpaqueToken-ize the asset service injection so this stays portable
	            protected assetSvc: Asset_Svc,
	            //TODO: OpaqueToken-ize the global event service injection so this stays portable
	            protected globalEventSvc: GlobalEvent_Svc){
		this.url = this.constants.url;
		this.bp = this.constants.breakpoint;
	}

	public setConfig(config: any) {
		this.content = config.content;
		this.config = config.config;
		this.setBackground();
	}

	public getSanHtml(str) {
		return this.sanitizer.bypassSecurityTrustHtml(str);
	}

	public getAssetUrl(filename) {
		return this.assetSvc.getAssetUrl(`${filename}`);
	}

	public updateResponsiveBackground() {
		let w = this.win.innerWidth;
		let newBp;
		let bg = this.config.background.value;

		for (var bp in this.bp) {
			if(this.bp.hasOwnProperty(bp) && w < this.bp[bp]){
				newBp = bp;
				break;
			}
		}
		if(!newBp) {
			newBp = bp;
		}

		if(this.currBp !== newBp){
			this.currBp = newBp;
			let parts = bg.split('.');
			parts.splice(parts.length - 1, 0, bp);
			bg = parts.join('.');
			this.config.style['background-image'] = `url("${this.getAssetUrl(bg)}")`
		}
	}

	private setBackground() {
		if(!this.config.background) {
			return;
		}

		let styles = this.constants.componentConfig.backgroundStyles;
		let bg = this.config.background;

		if(bg.style) {
			switch (bg.style.toLowerCase()) {
				case styles.image:
					this.config.style = {
						'background-image': `url("${this.getAssetUrl(bg.value)}")`,
						'background-size': bg['size'] || 'cover',
						'background-position': bg['position'] || 'center'
					};
					if(bg.responsive) {
						this.resizeHandlerId = this.globalEventSvc.registerResizeHandler(this.updateResponsiveBackground.bind(this));
						this.updateResponsiveBackground();
					}
					break;
				case styles.color:
					this.config.style = {
						background: bg.value
					};
					break;
				default:
					let msg = "Unrecognized background type set. Incorrect JSON. Try again.\nPossible options are:";
					for (var style in styles) {
						msg += `\n - ${style}`;
					}
					console.warn(msg);
					break;
			}
		}
	}

	ngOnDestroy() {
		this.globalEventSvc.unregisterResizeHandler(this.resizeHandlerId);
	}
}