import {PageCmpCfg_Mdl} from 'lm/site-common';

export class PageConfig_Mdl {
    config: any;
    component: Array<PageCmpCfg_Mdl> = [];

    constructor(cfg: any) {
        if (!cfg.config) {
            throw new Error(`This page's configuration is missing the required parameter 'config'.`);
        }
        if (!cfg.component) {
            throw new Error(`This page's configuration is missing the required parameter 'component'.`);
        }

        this.config = cfg.config;

        for (let i = 0, len = cfg.component.length; i < len; i++) {
            this.component.push(new PageCmpCfg_Mdl(cfg.component[i]));
        }

        if(cfg.debug) {
            console.log('Page config for current page:');
            console.log(this);
        }
    }
}