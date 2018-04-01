import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExtensionsRegistry} from 'lm/extensions';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        {
            provide: ExtensionsRegistry,
            useValue: {}
        }
    ]
})
export class Extensions_Mod {
}