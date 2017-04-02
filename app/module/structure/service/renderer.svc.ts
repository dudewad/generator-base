import {Inject,	Injectable,	ComponentFactoryResolver, ViewContainerRef} from '@angular/core';

import {App_Const} from '../../site-common/';
import {Copy_Cmp, DataTable_Cmp, Hero_Cmp, PageConfig_Mdl, StructureBase_Cmp, Ribbon_Cmp, TextImage_Cmp, TileSet_Cmp} from '../';

@Injectable()
export class Renderer_Svc {
	private compExt:string = '';
	//Register all components that could be instantiated dynamically here. Match the name to the token exactly.
	private componentRegistry:any = {
		'Copy_Cmp': Copy_Cmp,
		'DataTable_Cmp': DataTable_Cmp,
		'Hero_Cmp': Hero_Cmp,
		'Ribbon_Cmp': Ribbon_Cmp,
		'TextImage_Cmp': TextImage_Cmp,
		'TileSet_Cmp': TileSet_Cmp,
	};

	constructor(private resolver: ComponentFactoryResolver,
	            @Inject(App_Const) private constants) {
		this.compExt = constants.routeMap.componentExtension;
	}

	public clearPage(target: ViewContainerRef) {
		target.clear();
	}

	public renderPage(pageConfig:PageConfig_Mdl, parent: ViewContainerRef) {
		let configComponents = pageConfig.component;
		if (configComponents) {
			for (let i = 0, len = configComponents.length; i < len; i++) {
				let conf = configComponents[i];
				let factory = this.resolver.resolveComponentFactory(this.componentRegistry[conf.type + this.compExt]);
				let newComp = parent.createComponent(factory);
				let inst = <StructureBase_Cmp>newComp.instance;

				inst.setConfig(conf);
			}
		}
	}
}