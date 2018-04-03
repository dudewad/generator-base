import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'lm-form-field',
  template: require('./lm-form-field.cmp.html')
})
export class FormField_Cmp implements OnInit {
  @Input()
  public label: string;

  constructor() {
  }

  ngOnInit() {
  }
}