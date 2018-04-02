import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {Constants} from './app-constants.const';
import {Structure_Mod} from 'lm/structure';
import {App_Cmp} from './app.cmp';
import {App_Const, SiteCommon_Mod} from 'lm/site-common';
import {Routing} from './app.routes';

@NgModule({
    declarations: [
        App_Cmp
    ],
    imports: [
        BrowserModule,
        SiteCommon_Mod,
        Structure_Mod,
        Routing
    ],
    providers: [
        {
            provide: App_Const,
            useValue: Constants
        }
    ],
    bootstrap: [
        App_Cmp
    ]
})
export class App_Mod {
}