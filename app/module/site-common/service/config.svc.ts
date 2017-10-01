import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export const ConfigTypes: any = {
    app: 'app',
    global: 'global',
    page: 'page'
};

@Injectable()
export class Config_Svc {
    configUpdate: BehaviorSubject<any> = new BehaviorSubject<any>({});
    globalConfigUpdate: BehaviorSubject<any> = new BehaviorSubject<any>({});
    pageConfigUpdate: BehaviorSubject<any> = new BehaviorSubject<any>({});
    appConfigUpdate: BehaviorSubject<any> = new BehaviorSubject<any>({});

    private configs: any = {};

    constructor() {
    }

    setConfig(type, config: any, currentRoute?: any) {
        let eventData = {
            type,
            config,
            currentRoute
        };

        this.configs[type] = config;
        this.configUpdate.next(eventData);

        switch (type) {
            case ConfigTypes.app:
                this.appConfigUpdate.next(eventData);
                break;
            case ConfigTypes.global:
                this.globalConfigUpdate.next(eventData);
                break;
            case ConfigTypes.page:
                this.pageConfigUpdate.next(eventData);
                break;
        }
    }

    getConfig(type): any {
        return this.configs[type];
    }
}