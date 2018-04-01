import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {
    //Components
    Footer_Cmp,
    Header_Cmp,
    LocaleSwitcher_Cmp,
    Logo_Cmp,
    MainMenu_Cmp,
    MainMenuPage_Cmp,
    MainMenuToggle_Cmp,

    //Services
    Asset_Svc,
    Config_Svc,
    Localization_Svc,
    MainMenu_Svc,
    Metrics_Svc,

    //Factories
    StorageService_Fac,

    //Opaque Tokens
    StorageService
} from 'lm/site-common';

@NgModule({
    declarations: [
        Footer_Cmp,
        Header_Cmp,
        LocaleSwitcher_Cmp,
        Logo_Cmp,
        MainMenu_Cmp,
        MainMenuPage_Cmp,
        MainMenuToggle_Cmp
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        Footer_Cmp,
        Header_Cmp,
        MainMenu_Cmp,
        MainMenuToggle_Cmp,
        LocaleSwitcher_Cmp,
        Logo_Cmp
    ],
    providers: [
        Asset_Svc,
        Config_Svc,
        Localization_Svc,
        MainMenu_Svc,
        Metrics_Svc,
        {
            provide: StorageService,
            useFactory: StorageService_Fac,
            deps: []
        },
    ]
})

export class SiteCommon_Mod {
}