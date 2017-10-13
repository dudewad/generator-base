import {Inject, Injectable, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';

import {App_Const} from 'lm/site-common';
import {
    Copy_Cmp,
    DataTable_Cmp,
    Hero_Cmp,
    Ribbon_Cmp,
    StructureBase_Cmp,
    TextImage_Cmp,
    TileSet_Cmp
} from 'lm/structure';

@Injectable()
export class Renderer_Svc {
    private compExt: string = '';
    //Register all components that could be instantiated dynamically here. Match the name to the token exactly.
    private componentRegistry: any = {
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

    public renderPage(pageConfig: any, parent: ViewContainerRef) {
        let cmps = pageConfig.component;
        if (cmps) {
            for (let i = 0, len = cmps.length; i < len; i++) {
                let conf = cmps[i];
                let factory = this.resolver.resolveComponentFactory(this.componentRegistry[conf.type + this.compExt]);
                let newComp = parent.createComponent(factory);
                let inst = <StructureBase_Cmp>newComp.instance;

                inst.setConfig(conf);
            }
        }
    }
}