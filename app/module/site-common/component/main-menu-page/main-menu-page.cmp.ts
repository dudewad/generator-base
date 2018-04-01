import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MainMenu_Svc } from 'lm/site-common';

export const MainMenuItemStyles: any = {
    link: 'link',
    button: 'button'
};

@Component({
    selector: 'main-menu-page',
    template: require('./main-menu-page.cmp.html'),
    styles: [require('./main-menu-page.cmp.scss')]
})
export class MainMenuPage_Cmp implements OnChanges {
    @Input('content')
    public page: any;
    public items$: BehaviorSubject<any> = new BehaviorSubject<Array<any>>([]);
    public itemStyles: any = MainMenuItemStyles;

    constructor(private mainMenuSvc: MainMenu_Svc,
                private sanitizer: DomSanitizer) {
    }

    ngOnChanges(changes) {
        let page = changes.page.currentValue;
        let items = [];

        for (let i = 0; i < page.items.length; i++) {
            let item = {...page.items[i]};
            let href = item.href;

            if (href) {
                let base = href.split('#')[0].split('?')[0];
                let extras: {[idx: string]: any} = {};
                if (href.indexOf('#') > -1) {
                    extras.fragment = href.split('#')[1].split('?')[0];
                }
                if (href.indexOf('?') > -1) {
                    let params = href.split('?')[1].split('&');

                    extras.queryParams = {};

                    for(let j = 0; j < params.length; j++) {
                        let param = params[j].split('=');
                        extras.queryParams[param[0]] = param[1];
                    }
                }

                item.routerLink = [base, extras];
            }
            items.push(item);
        }

        this.items$.next(items);
    }

    onLinkClick(item: any) {
        this.closeMenu();
    }

    closeMenu() {
        this.mainMenuSvc.toggle(false);
    }

    openMenuPage(page: any) {
        this.mainMenuSvc.addPage(page);
    }

    sanitizeUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    popPage() {
        this.mainMenuSvc.popPage(true);
    }
}