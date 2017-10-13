export class AppConfig_Mdl {
    globalConfig: string;
    localization: any;
    routes: any;
    vendor: any;

    constructor(cfg: any) {
        if (!cfg.globalConfig) {
            throw new Error(`App configuration is missing the required parameter 'globalConfig'. This parameter must point to a valid Global config json file or the app will be unable to bootstrap.`);
        }

        if(!cfg.routes) {
            throw new Error(`App configuration is missing the required parameter 'routes'. Routes must be defined or the app cannot bootstrap.`);
        }

        this.globalConfig = cfg.globalConfig;
        this.localization = cfg.localization || {};
        this.routes = cfg.routes;
        this.vendor = cfg.vendor;
    }
}