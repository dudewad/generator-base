import {Inject, Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {NavigationEnd, Router} from '@angular/router';
import {ReplaySubject, Subscription} from 'rxjs';

import {App_Const, AppConfig_Mdl, ConfigUpdate_Mdl, GlobalConfig_Mdl, PageConfig_Mdl} from 'lm/site-common';

export const ConfigTypes: any = {
    app: 'app',
    global: 'global',
    page: 'page'
};

@Injectable()
export class Config_Svc {
    globalConfigUpdate: ReplaySubject<any> = new ReplaySubject<any>(1);
    pageConfigUpdate: ReplaySubject<any> = new ReplaySubject<any>(1);
    appConfigUpdate: ReplaySubject<any> = new ReplaySubject<any>(1);

    private configs: any = {};
    private routerEventSub: Subscription;
    private loadingAppCfg: boolean = false;

    constructor(private router: Router,
                private http: Http,
                @Inject(App_Const) private constants) {

        this.routerEventSub = this.router.events
            .filter(evt => evt instanceof NavigationEnd)
            .subscribe(_ => this.loadPageCfg());
    }

    setConfig(type, config: any) {
        this.configs[type] = config;

        switch (type) {
            case ConfigTypes.app:
                this.configs.app = new AppConfig_Mdl(config);
                this.appConfigUpdate.next(new ConfigUpdate_Mdl(
                    this.configs.app,
                    this.getCurrentRoute())
                );
                this.loadGlobalConfig();
                this.loadPageCfg();
                break;
            case ConfigTypes.global:
                this.globalConfigUpdate.next(new ConfigUpdate_Mdl(
                    new GlobalConfig_Mdl(config),
                    this.getCurrentRoute())
                );
                break;
            case ConfigTypes.page:
                this.pageConfigUpdate.next(new ConfigUpdate_Mdl(
                    new PageConfig_Mdl(config),
                    this.getCurrentRoute()
                ));
                break;
        }
    }

    getConfig(type): any {
        return this.configs[type];
    }

    loadAppCfg(cfgUrl: string) {
        //Only load app configuration one time.
        if (this.configs.app || this.loadingAppCfg) {
            return;
        }

        this.loadingAppCfg = true;

        this.http.get(cfgUrl)
            .map(res => res.json())
            .subscribe(result => {
                    this.loadingAppCfg = false;
                    this.setConfig(ConfigTypes.app, result);
                },
                error => {
                    //TODO: Don't throw an error, catch it and redirect to a 404/"omg its broken" page.
                    throw new Error(`Critical error - could not load site route map. The resource '${cfgUrl}' could not be found.`);
                });
    }


    private loadGlobalConfig() {
        this.http.get(this.constants.url.dataRoot + this.configs.app['globalConfig'])
            .map(res => res.json())
            .subscribe(result => {
                    this.setConfig(ConfigTypes.global, result);
                },
                error => {
                });
    }

    private getCurrentRoute() {
        let path: string = this.router.routerState.snapshot.url || '';

        if (path[0] === '/') {
            path = path.substring(1);
            path = path.split('?')[0];
        }

        return path;
    }

    /**
     * Retrieve page-specific configuration JSON files.
     */
    private loadPageCfg() {
        if (!this.configs.app) {
            return;
        }

        let path = this.getCurrentRoute();
        let url = this.constants.url.dataRoot;
        let routes = this.configs.app.routes;
        let defaultKey = this.constants.routeMap.routeDataDefaultKey;

        path = path[0] === '/' ? path : '/' + path;
        if (routes.hasOwnProperty(path)) {
            url += routes[path];
        }
        else if (routes.hasOwnProperty(defaultKey)) {
            console.warn(`Falling back to default page for path ${path}`);
            url += routes[defaultKey];
        }
        else {
            //TODO: No default and no recognized path. Bail/404 instead of erroring out
            throw new Error(`No matching page found for route path ${path}`);
        }

        this.http.get(url)
            .map(res => res.json())
            .subscribe(result => {
                    this.setConfig(ConfigTypes.page, result);
                },
                error => {
                    //TODO: Redirect to 404
                    console.warn(`Error retrieving page JSON file for ${url}. The file does not exist.`);
                });
    }
}