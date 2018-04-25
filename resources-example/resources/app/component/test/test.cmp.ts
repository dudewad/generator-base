import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  App_Const,
  Asset_Svc,
  GlobalEvent_Svc,
  Localization_Svc
} from 'lm/site-common';
import { StructureBase_Cmp } from 'lm/structure';

import { Test_Svc } from 'lm/extensions';
import { Test_Mdl } from 'lm/extensions';

@Component({
  selector: 'test-component',
  template: require('./test.cmp.html'),
  styles: [require('./test.cmp.scss')]
})
export class Test_Cmp extends StructureBase_Cmp {
  constructor(testSvc: Test_Svc,
              protected sanitizer: DomSanitizer,
              @Inject(App_Const) protected constants,
              protected assetSvc: Asset_Svc,
              protected globalEventSvc: GlobalEvent_Svc,
              protected locSvc: Localization_Svc,
              protected cdr: ChangeDetectorRef) {
    super(sanitizer, constants, assetSvc, globalEventSvc, locSvc, cdr);
    testSvc.doTest();
    let mdl = new Test_Mdl('Hello World!');
    mdl.test();
  }
}