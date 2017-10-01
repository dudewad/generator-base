import 'zone.js';
import 'reflect-metadata';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {App_Mod} from './app.mod';

if (ENV === 'production' || ENV === 'prod') {
    enableProdMode();
}
if(VERSION) {
    console.log(`Generator version: ${VERSION}`);
}
const platform = platformBrowserDynamic();
platform.bootstrapModule(App_Mod);