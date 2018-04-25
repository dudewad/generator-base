import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  App_Const,
  Asset_Svc,
  GlobalEvent_Svc,
  Localization_Svc,
  PageCmpCfg_Mdl
} from 'lm/site-common';
import { ContentToggle_Svc, StructureBase_Cmp } from 'lm/structure';

@Component({
  selector: 'content-toggle',
  template: require('./content-toggle.cmp.html'),
  styles: [require('./content-toggle.cmp.scss')]
})
export class ContentToggle_Cmp extends StructureBase_Cmp {
  public selectedTarget: string;
  private targets: { [id: string]: HTMLElement } = {};

  constructor(protected sanitizer: DomSanitizer,
              @Inject(App_Const) protected constants,
              protected assetSvc: Asset_Svc,
              protected globalEventSvc: GlobalEvent_Svc,
              protected locSvc: Localization_Svc,
              protected cdr: ChangeDetectorRef,
              private toggleSvc: ContentToggle_Svc) {
    super(sanitizer, constants, assetSvc, globalEventSvc, locSvc, cdr);
    this.toggleSvc.register(this);
  }

  public ngOnDestroy() {
    this.toggleSvc.unregister(this);
  }

  public getId() {
    return this.config.id;
  }

  public setConfig(cfg: PageCmpCfg_Mdl) {
    super.setConfig(cfg);
    let defaultTarget = this.config.defaultTarget
      || this.content.toggles[0].target;

    this.targets = {};
    setTimeout(() => {
      let toggles = this.content.toggles;
      let toggle;
      let element;

      if (!document.querySelector(`#${defaultTarget}`)) {
        console.warn('Invalid defaultTarget "' + defaultTarget + '" set for ' +
          'ContentToggle component. Check the id and make sure that ' +
          'it exists.');
      }

      // Cache all target elements
      for (let i = 0, len = toggles.length; i < len; i++) {
        toggle = toggles[i];
        element = document.querySelector(`#${toggle.target}`);

        if (!element) {
          console.warn('Couldn\'t find target element "' + toggle.target +
            '" for ContentToggle component. Check the name and ' +
            'make sure that an element on the page has that id.');
          continue;
        }

        this.targets[toggle.target] = element;

        // Hide any that aren't the default display target
        if (defaultTarget !== toggle.target) {
          this.deselect(toggle);
        }
        else {
          this.select(toggle);
        }
      }
    }, 0);
  }

  public onToggleClick(toggle) {
    this.deselectAllTargets();
    this.select(toggle);
  }

  public deselectAllTargets() {
    for (let i = 0, len = this.content.toggles.length; i < len; i++) {
      this.deselect(this.content.toggles[i]);
    }
  }

  public onHide() {
    if (this.config.disableTargetsOnHide) {
      this.selectedTarget = undefined;
      this.deselectAllTargets();

    }
  }

  private deselect(toggle) {
    const target = this.targets[toggle.target];

    this.toggleSvc.onToggleHide(this, toggle.target);

    if(target) {
      target.style.display = 'none';
    }
  }

  private select(toggle) {
    this.targets[toggle.target].style.display = 'block';
    this.selectedTarget = toggle.target;
  }
}