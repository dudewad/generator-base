import {AppConfig_Mdl, GlobalConfig_Mdl, PageConfig_Mdl} from 'lm/site-common';

export class ConfigUpdate_Mdl {
    config: AppConfig_Mdl|GlobalConfig_Mdl|PageConfig_Mdl;
    currentRoute: string;

    constructor(cfg: AppConfig_Mdl | GlobalConfig_Mdl | PageConfig_Mdl,
                currentRoute: string) {
        this.config = cfg;
        this.currentRoute = currentRoute;
    }
}