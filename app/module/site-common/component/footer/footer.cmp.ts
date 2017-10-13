import {Component, OnDestroy, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Subscription} from 'rxjs';

import {Config_Svc, ConfigUpdate_Mdl, GlobalConfig_Mdl, LocalizableContent_Mdl, Localization_Svc} from "lm/site-common";

@Component({
    selector: 'site-footer',
    template: require('./footer.cmp.html'),
    styles: [require('./footer.cmp.scss')],
    encapsulation: ViewEncapsulation.None
})

export class Footer_Cmp implements OnDestroy {
    content: any = {};
    @ViewChild('localeSwitcher', {read: ViewContainerRef}) localeSwitcher: ViewContainerRef;

    private config: any;
    private configSvcSub: Subscription;
    private locContentObj: LocalizableContent_Mdl;

    constructor(private configSvc: Config_Svc,
                private locSvc: Localization_Svc,
                private sanitizer: DomSanitizer) {
        this.configSvcSub = this.configSvc.globalConfigUpdate
            .subscribe((data: ConfigUpdate_Mdl) => {
                this.onConfigChange(<GlobalConfig_Mdl>data.config)
            });
    }

    ngOnDestroy() {
        this.configSvcSub.unsubscribe();
        this.locContentObj && this.locContentObj.unregister();
    }

    getSanHtml(str) {
        return this.sanitizer.bypassSecurityTrustHtml(str);
    }

    getDate() {
        return new Date().getFullYear();
    }

    private onConfigChange(cfg: GlobalConfig_Mdl) {
        this.config = cfg.component.footer;
        this.locContentObj && this.locContentObj.unregister();
        this.locContentObj = this.locSvc.registerContent(this.config.content);
        this.content = this.locContentObj.content;
    }
}