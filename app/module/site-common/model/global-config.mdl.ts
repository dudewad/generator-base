export class GlobalConfig_Mdl {
    config: any;
    component: any = {};

    constructor(cfg: any) {
        if (!cfg.component) {
            throw new Error(`Global configuration is missing the required parameter 'component'.`);
        }

        // Presently there are no global config options... this is for forward compatibility
        this.config = cfg.config;

        for(let c in cfg.component) {
            if(cfg.component.hasOwnProperty(c)) {
                this.component[c] = cfg.component[c];
            }
        }

        if(cfg.debug) {
            console.log('Global config:');
            console.log(this);
        }
    }
}