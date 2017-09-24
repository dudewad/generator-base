import {Component} from '@angular/core';
import {Subscription} from 'rxjs';

import {Config_Svc, LocalizableContent_Mdl, Localization_Svc} from "lm/site-common";

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

    private localizableContentObj: LocalizableContent_Mdl;
    private config: any;
    private configSvcSub: Subscription;

    constructor(private configSvc: Config_Svc,
                private localizationSvc: Localization_Svc) {
        this.locale = localizationSvc.getCurrentLocale();
        this.localizationSvc.localeUpdatedEvent.subscribe(locale => {
            this.locale = locale;
            this.locales = this.localizationSvc.getLocales();
            this.available = this.locales.length > 1;
        });
        this.configSvcSub = this.configSvc.globalConfigUpdate
            .subscribe(data => {
                this.onConfigChange(data.config);
            });
    }

    toggle() {
        this.active = !this.active;
    }

    handleLocaleClick(locale: any) {
        this.localizationSvc.setLocale(locale.locale);
        this.toggle();
    }

    private onConfigChange(config) {
        this.config = config && config.component && config.component.localeSwitcher;
        if (!this.config) {
            return;
        }
        this.localizableContentObj && this.localizableContentObj.unregister();
        this.localizableContentObj = this.localizationSvc.registerContent(this.config.content);
        this.content = this.localizableContentObj.content;
    }
}