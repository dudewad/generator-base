export class PageCmpCfg_Mdl {
    type: string;
    config: any;
    content: any;

    constructor(cfg: any) {
        if (!cfg.type) {
            throw new Error(`A component on this page is missing the required parameter 'type'.`);
        }
        if (!cfg.config) {
            throw new Error(`A component on this page is missing the required parameter 'config' - component type is ${cfg.type}.`);
        }
        if (!cfg.content) {
            throw new Error(`A component on this page is missing the required parameter 'content' - component type is ${cfg.type}.`);
        }

        this.type = cfg.type;
        this.config = cfg.config;
        this.content = cfg.content;
    }
}