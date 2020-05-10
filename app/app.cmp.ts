import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';

import {
    App_Const, AppConfig_Mdl, Config_Svc, ConfigUpdate_Mdl, Metrics_Svc, PageConfig_Mdl
} from './module/site-common';

@Component({
    selector: 'app-main',
    template: require('./app.cmp.html'),
    styles: [require('./app.scss')],
    encapsulation: ViewEncapsulation.None
})
export class App_Cmp implements OnInit {
    state: any = {
        mainMenu: false,
        header: false,
        footer: false
    };

    constructor(private configSvc: Config_Svc,
                private metricsSvc: Metrics_Svc,
                @Inject(App_Const) private constants) {
        this.configSvc.pageConfigUpdate
            .subscribe((data: ConfigUpdate_Mdl) => {
                let pageData = <PageConfig_Mdl>data.config;
                let cfg = pageData.config;

                this.state.header = cfg.header;
                this.state.footer = cfg.footer;
                this.state.mainMenu = cfg.mainMenu;
            });

        let appCfgSub = this.configSvc.appConfigUpdate
            .subscribe((data: ConfigUpdate_Mdl) => {
                let cfg: AppConfig_Mdl = <AppConfig_Mdl>data.config;

                if (cfg.vendor && cfg.vendor.metrics) {
                    this.metricsSvc.init(cfg.vendor.metrics);
                }
                appCfgSub.unsubscribe();
            })
    }

    ngOnInit() {
        this.configSvc.loadAppCfg(this.constants.url.dataRoot + this.constants.url.config);
    }
}
