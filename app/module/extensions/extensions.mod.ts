import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExtensionsRegistry} from 'lm/extensions';


    import {
        
            Test_Cmp
        
    } from 'lm/extensions';



    import {
    
        Test_Svc
    
    } from 'lm/extensions';

    let ExtensionsSvcs = [
        
            Test_Svc
        
    ];



    const ExtensionsCmps = {
        
            'Test': Test_Cmp
        
    };
    const comps = Object.values(ExtensionsCmps);


@NgModule({
    declarations: [
        
            ...comps
        
    ],
    exports: [
        
            ...comps
        
    ],
    
        entryComponents: [
            ...comps
        ],
    
    imports: [
        CommonModule
    ],
    providers: [
        
            ...ExtensionsSvcs,
        
        {
            provide: ExtensionsRegistry,
            
                useValue: ExtensionsCmps
            
        }
    ]
})
export class Extensions_Mod {
}