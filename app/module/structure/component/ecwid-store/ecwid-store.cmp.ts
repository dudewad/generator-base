import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { EcwidSvc } from '../../service';
import {
  App_Const,
  Asset_Svc,
  Config_Svc,
  ConfigTypes,
  GlobalEvent_Svc,
  Localization_Svc
} from 'lm/site-common';
import { StructureBase_Cmp } from 'lm/structure';

@Component({
  selector: 'ecwid-store',
  template: require('./ecwid-store.cmp.html'),
  styles: [require('./ecwid-store.cmp.scss')],
})
export class EcwidStore_Cmp extends StructureBase_Cmp implements OnDestroy, AfterViewInit {
  public storeId: string;
  @ViewChild('storeParent')
  public storeParentEl: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected sanitizer: DomSanitizer,
    @Inject(App_Const) protected constants,
    protected assetSvc: Asset_Svc,
    protected globalEventSvc: GlobalEvent_Svc,
    protected locSvc: Localization_Svc,
    protected cdr: ChangeDetectorRef,
    private configSvc: Config_Svc,
    private ecwidSvc: EcwidSvc) {
    super(sanitizer, constants, assetSvc, globalEventSvc, locSvc, cdr);
    this.ecwidSvc.load(this.configSvc.getConfig(ConfigTypes.app).vendor.ecwid.storeId);
  }

  /**
   * AfterViewInit Interface Method
   */
  public ngAfterViewInit() {
    this.ecwidSvc.init(this.storeParentEl.nativeElement);
  }

  /**
   * OnDestroy Interface Method
   */
  public ngOnDestroy() {
    this.ecwidSvc.reset();
  }
}
