import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'lm-form-field',
  template: require('./lm-form-field.cmp.html')
})
export class FormField_Cmp implements OnInit {
  @Input()
  public label: string;
  @HostBinding('attr.class')
  @Input()
  public className: string;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  public getSanHtml(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }
}
