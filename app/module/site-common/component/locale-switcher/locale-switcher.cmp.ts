import {Component} from '@angular/core';
import {Subscription} from 'rxjs';

import {Config_Svc, ConfigUpdate_Mdl, GlobalConfig_Mdl, LocalizableContent_Mdl, Localization_Svc} from 'lm/site-common';

@Component({
    selector: 'locale-switcher',
    template: require('./locale-switcher.cmp.html'),
    styles: [require('./locale-switcher.cmp.scss')]
})
export class LocaleSwitcher_Cmp {
    //Active refers to open/closed state
    active: boolean = false;
    //Available refers to whether or not to even show the selector. Sites with < 2 locales should not show pickers and
    //this value is set accordingly
    available: boolean = false;
    content: any = {};
    locale: any;
    locales: Array<any> = [];

    private locContentObj: LocalizableContent_Mdl;
    private config: any;
    private configSvcSub: Subscription;

    constructor(private configSvc: Config_Svc,
                private locSvc: Localization_Svc) {
        this.locale = locSvc.getCurrentLocale();

        this.locSvc.localeUpdatedEvent.subscribe(locale => {
            this.locale = locale;
            this.locales = this.locSvc.getLocales();
            this.available = this.locales && this.locales.length > 1;
        });

        this.configSvcSub = this.configSvc.globalConfigUpdate
            .subscribe((data: ConfigUpdate_Mdl) => {
                this.onConfigChange(<GlobalConfig_Mdl>data.config);
            });
    }

    toggle() {
        this.active = !this.active;
    }

    handleLocaleClick(locale: any) {
        this.locSvc.setLocale(locale.locale);
        this.toggle();
    }

    private onConfigChange(cfg: GlobalConfig_Mdl) {
        this.config = cfg.component.localeSwitcher;
        if (!this.config) {
            return;
        }
        this.locContentObj && this.locContentObj.unregister();
        this.locContentObj = this.locSvc.registerContent(this.config.content);
        this.content = this.locContentObj.content;
    }
}