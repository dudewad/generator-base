import { ViewContainerRef } from '@angular/core';

export class GoogleMapsConfig_Mdl {
	private map:google.maps.Map;
	private resizeHandlerId:any;

	constructor(private elRef: ViewContainerRef,
				private mapConfig:any) {
	}

	getViewContainerRef() {
		return this.elRef;
	}

	getNativeElement() {
		return this.elRef.element.nativeElement;
	}

	getConfig() {
		return this.mapConfig;
	}

	getMap() {
		return this.map;
	}

	setMap(map) {
		this.map = map;
	}

	setResizeHandlerId(id:any) {
		this.resizeHandlerId = id;
	}

	getResizeHandlerId() {
		return this.resizeHandlerId || null;
	}
}