import {
  Inject,
  Injectable,
  ComponentFactoryResolver,
  ViewContainerRef
} from '@angular/core';

import { App_Const } from 'lm/site-common';
import {
  ContentToggle_Cmp,
  Copy_Cmp,
  DataTable_Cmp,
  Form_Cmp,
  Hero_Cmp,
  Ribbon_Cmp,
  StructureBase_Cmp,
  TextImage_Cmp,
  TileSet_Cmp
} from 'lm/structure';
import { ExtensionsRegistry } from "lm/extensions";

@Injectable()
export class Renderer_Svc {
  private compExt: string = '';
  //Register all components that could be instantiated dynamically here. Match the name to the token exactly.
  private componentRegistry: any = {
    'ContentToggle_Cmp': ContentToggle_Cmp,
    'Copy_Cmp': Copy_Cmp,
    'DataTable_Cmp': DataTable_Cmp,
    'Form_Cmp': Form_Cmp,
    'Hero_Cmp': Hero_Cmp,
    'Ribbon_Cmp': Ribbon_Cmp,
    'TextImage_Cmp': TextImage_Cmp,
    'TileSet_Cmp': TileSet_Cmp,
  };

  constructor(private resolver: ComponentFactoryResolver,
              @Inject(App_Const) private constants,
              @Inject(ExtensionsRegistry) private extRegistry) {
    this.compExt = constants.routeMap.componentExtension;
    this.mergeRegistries();
  }

  public clearPage(target: ViewContainerRef) {
    target.clear();
  }

  public renderPage(pageConfig: any, parent: ViewContainerRef) {
    let cmps = pageConfig.component;
    if (cmps) {
      for (let i = 0, len = cmps.length; i < len; i++) {
        let conf = cmps[i];
        let factory;
        try {
          factory = this.resolver.resolveComponentFactory(this.componentRegistry[conf.type + this.compExt]);
        }
        catch (e) {
          console.log(e);
          throw new Error(`There was an error resolving the component ${conf.type}${this.compExt}. This usually means that a third party extension is improperly named.`)
        }
        let newComp = parent.createComponent(factory);
        let inst = <StructureBase_Cmp>newComp.instance;

        inst.setConfig(conf);
      }
    }
  }

  private mergeRegistries() {
    let reg = this.extRegistry;
    for (let c in reg) {
      if (reg.hasOwnProperty(c)) {
        if (this.componentRegistry.hasOwnProperty(c)) {
          throw new Error(`An extension component {${c}} has been added that already exists in the core generator-base registry. Name collisions are not allowed; you must rename your component to continue.`);
        }
        this.componentRegistry[c + this.compExt] = reg[c];
      }
    }
  }
}