import {Component, ViewChild, ViewContainerRef, ViewEncapsulation, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {Config_Svc, ConfigTypes, LocalizableContent_Mdl, Localization_Svc} from 'lm/site-common';

@Component({
    selector: 'site-header',
    template: require('./header.cmp.html'),
    styles: [require('./header.cmp.scss')],
    encapsulation: ViewEncapsulation.None
})

export class Header_Cmp implements OnDestroy {
    content: any = {};
    hasMainMenu: boolean = false;
    @ViewChild('localeSwitcher', {read: ViewContainerRef}) localeSwitcher: ViewContainerRef;

    private localizableContentObj: LocalizableContent_Mdl;
    private config: any;
    private configSvcSub: Subscription;

    constructor(private configSvc: Config_Svc,
                private localizationSvc: Localization_Svc) {
        this.configSvcSub = this.configSvc.globalConfigUpdate
            .merge(this.configSvc.pageConfigUpdate)
            .subscribe(data => {
                switch(data.type) {
                    case ConfigTypes.global:
                        this.onGlobalCfgChange(data.config);
                        break;
                    case ConfigTypes.page:
                        this.onPageConfigChange(data.config);
                        break;
                }
            });
    }

    ngOnDestroy() {
        this.configSvcSub.unsubscribe();
        this.localizableContentObj && this.localizableContentObj.unregister();
    }

    private onPageConfigChange(pageCfg: any) {
        this.hasMainMenu = !!pageCfg.config.mainMenu;
    }

    private onGlobalCfgChange(config: any) {
        if (!config) {
            return;
        }
        this.config = config.component.header;
        this.hasMainMenu = !!config.component.mainMenu;
        this.localizableContentObj && this.localizableContentObj.unregister();
        this.localizableContentObj = this.localizationSvc.registerContent(this.config.content);
        this.content = this.localizableContentObj.content;
    }
}