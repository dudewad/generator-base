import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Config_Svc, ConfigUpdate_Mdl, PageConfig_Mdl} from 'lm/site-common';
import {Renderer_Svc} from 'lm/structure';

@Component({
    selector: 'structure',
    template: require('./structure-builder.cmp.html'),
    styles: [require('./structure-builder.cmp.scss')],
    encapsulation: ViewEncapsulation.None
})
export class StructureBuilder_Cmp implements OnInit, OnDestroy {
    private configSvcSub: Subscription;
    private body: any = document.getElementsByTagName("body")[0];
    //View child contains the rendered content for the structure
    @ViewChild('structure', {read: ViewContainerRef}) structureContainer: ViewContainerRef;

    constructor(private configSvc: Config_Svc,
                private renderer: Renderer_Svc) {
    }

    ngOnInit() {
        this.configSvcSub = this.configSvc.pageConfigUpdate
            .subscribe((data: ConfigUpdate_Mdl) => {
                this.onPageConfigChange(<PageConfig_Mdl>data.config);
            });
    }

    /**
     * Handler for when page config files get loaded
     *
     * @param cfg
     */
    private onPageConfigChange(cfg: PageConfig_Mdl) {
        this.renderer.clearPage(this.structureContainer);
        this.renderer.renderPage(cfg, this.structureContainer);
        this.body.scrollTop = 0;
    }

    ngOnDestroy() {
        this.configSvcSub.unsubscribe();
    }
}