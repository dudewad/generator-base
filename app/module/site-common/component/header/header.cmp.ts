import {Component, ViewChild, ViewContainerRef, ViewEncapsulation, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {merge} from 'rxjs/operators';

import {Config_Svc, ConfigUpdate_Mdl, GlobalConfig_Mdl, LocalizableContent_Mdl, Localization_Svc, PageConfig_Mdl} from 'lm/site-common';

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

    private locContentObj: LocalizableContent_Mdl;
    private config: any;
    private configSvcSub: Subscription;

    constructor(private configSvc: Config_Svc,
                private locSvc: Localization_Svc) {
        this.configSvcSub = this.configSvc.globalConfigUpdate
            .pipe(merge(this.configSvc.pageConfigUpdate))
            .subscribe((data: ConfigUpdate_Mdl) => {
                if(data.config instanceof PageConfig_Mdl) {
                    this.onPageCfgChange(<PageConfig_Mdl>data.config);
                }
                if(data.config instanceof GlobalConfig_Mdl) {
                    this.onGlobalCfgChange(<GlobalConfig_Mdl>data.config);
                }
            });
    }

    ngOnDestroy() {
        this.configSvcSub.unsubscribe();
        this.locContentObj && this.locContentObj.unregister();
    }

    private onPageCfgChange(pageCfg: PageConfig_Mdl) {
        this.hasMainMenu = !!pageCfg.config.mainMenu;
    }

    private onGlobalCfgChange(config: GlobalConfig_Mdl) {
        this.config = config.component.header;
        this.hasMainMenu = !!config.component.mainMenu;
        this.locContentObj && this.locContentObj.unregister();
        this.locContentObj = this.locSvc.registerContent(this.config.content);
        this.content = this.locContentObj.content;
    }
}