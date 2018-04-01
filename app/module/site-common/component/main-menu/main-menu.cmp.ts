import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import {
    LocalizableContent_Mdl,
    Localization_Svc,
    MainMenu_Svc
} from 'lm/site-common';

@Component({
    selector: 'main-menu',
    template: require('./main-menu.cmp.html'),
    styles: [require('./main-menu.cmp.scss')]
})

export class MainMenu_Cmp implements OnDestroy {
    public config: any = {};
    public localizableContentMdl: LocalizableContent_Mdl;
    public state: any = {
        active: false
    };
    public pages: Array<any> = [];
    @ViewChild('menuContent')
    public menuContent: ElementRef;

    private destroy$: Subject<void> = new Subject<void>();

    constructor(private locSvc: Localization_Svc,
                private mainMenuSvc: MainMenu_Svc) {
        mainMenuSvc.menuStatus
            .takeUntil(this.destroy$)
            .subscribe(active => this.state.active = active);

        this.mainMenuSvc.menuConfigUpdate
            .takeUntil(this.destroy$)
            .subscribe(data => {
                this.onConfigUpdate(data);
            });

        this.mainMenuSvc.menuPagePopped
            .takeUntil(this.destroy$)
            .merge(this.mainMenuSvc.menuPageAdded)
            .subscribe(pagesArr => this.pages = pagesArr);
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    onConfigUpdate(cfg: any) {
        this.config = cfg;
        this.localizableContentMdl && this.localizableContentMdl.unregister();
        this.localizableContentMdl = this.locSvc.registerContent(cfg.content);
        this.mainMenuSvc.addPage(this.localizableContentMdl.content);
    }

    handleBackdropClick() {
        this.mainMenuSvc.toggle(false);
    }
}