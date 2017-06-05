import { Component, Inject, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { App_Const, Asset_Svc, GlobalEvent_Svc, Localization_Svc, LocalizableContent_Mdl } from 'lm/site-common';

const ComponentConfig: any = {
	backgroundStyles: {
		image: 'image',
		color: 'color'
	}
};

@Component({})
export abstract class StructureBase_Cmp implements OnDestroy {
	protected config: any = {};
	protected content: any = {};
	private localizableContentObj: LocalizableContent_Mdl;
	private url: any = {};
	private resizeHandlerId: number;
	private win: any = window;
	private bp: any;
	private currBp: string;
	private rawConfig: any;

	constructor(protected sanitizer: DomSanitizer,
	            @Inject(App_Const) protected constants,
	            //TODO: OpaqueToken-ize the asset service injection so this stays portable
	            protected assetSvc: Asset_Svc,
	            //TODO: OpaqueToken-ize the global event service injection so this stays portable
	            protected globalEventSvc: GlobalEvent_Svc,
				protected localizationSvc: Localization_Svc){
		this.url = this.constants.url;
		this.bp = this.constants.breakpoint;
	}

	public setConfig(config: any) {
		this.rawConfig = config;
		this.config = config.config;
		this.localizableContentObj && this.localizableContentObj.unregister();
		this.localizableContentObj = this.localizationSvc.registerContent(config.content);
		this.content = this.localizableContentObj.content;
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
		let bp;

		for (bp in this.bp) {
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

		let styles = ComponentConfig.backgroundStyles;
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
					for (let style in styles) {
						msg += `\n - ${style}`;
					}
					console.warn(msg);
					break;
			}
		}
	}

	ngOnDestroy() {
		this.localizableContentObj.unregister();
		this.globalEventSvc.unregisterResizeHandler(this.resizeHandlerId);
	}
}