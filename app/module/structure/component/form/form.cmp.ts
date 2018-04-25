import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { catchError, takeUntil } from 'rxjs/operators';

import {
  App_Const,
  Asset_Svc,
  GlobalEvent_Svc,
  Localization_Svc
} from 'lm/site-common';
import { StructureBase_Cmp } from 'lm/structure';
import { ErrorObservable } from "rxjs/observable/ErrorObservable";

const fieldTypes = {
  text: 'text',
  textarea: 'textarea',
};

@Component({
  selector: 'lm-form',
  template: require('./form.cmp.html'),
  styles: [require('./form.cmp.scss')]
})
export class Form_Cmp extends StructureBase_Cmp {
  public fieldTypes;
  public form: FormGroup;
  public sending = false;
  public successMessage: string;
  public errorMessage: string;

  constructor(protected sanitizer: DomSanitizer,
              @Inject(App_Const) protected constants,
              protected assetSvc: Asset_Svc,
              protected globalEventSvc: GlobalEvent_Svc,
              protected locSvc: Localization_Svc,
              protected cdr: ChangeDetectorRef,
              private http: HttpClient,
              private fb: FormBuilder) {
    super(sanitizer, constants, assetSvc, globalEventSvc, locSvc, cdr);
    this.fieldTypes = fieldTypes;
    this.form = fb.group([]);
    this.onConfigChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.buildFormGroup.bind(this));

    this.buildFormGroup();
  }

  public onSubmit(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    if (this.form.valid) {
      this.sending = true;

      this.http
        .post(this.config.formAction, this.form.getRawValue())
        .pipe(catchError((err: HttpErrorResponse) => {
          console.log(err);
          return new ErrorObservable(err);
        }))
        .subscribe(
          result => {
            if (this.content.notification
              && this.content.notification.success
              && this.content.notification.success.text) {
              this.successMessage = this.content.notification.success.text;

              if (this.config.notificationDisplayTime) {
                Observable.timer(this.config.notificationDisplayTime)
                  .subscribe(() => this.successMessage = null);
              }
            }
            this.sending = false;
          },
          error => {
            console.log(this.content.notification);
            if (this.content.notification
              && this.content.notification.error
              && this.content.notification.error.text) {
              this.errorMessage = this.content.notification.error.text;

              if (this.config.notificationDisplayTime) {
                Observable.timer(this.config.notificationDisplayTime)
                  .subscribe(() => this.errorMessage = null);
              }
            }
            this.sending = false;
          });
    }
  }

  private buildFormGroup() {
    const formCfg = {};
    const fields = this.content.field;

    if (!fields) {
      return;
    }

    for (let i = 0, len = fields.length; i < len; i++) {
      const field = fields[i];
      const validators = [];

      for (let key in field.validators) {
        if (field.validators.hasOwnProperty(key)
          && Validators.hasOwnProperty(key)) {
          if (key === 'required') {
            validators.push(Validators.required);
          }
          else {
            validators.push(Validators[key](field.validators[key]));
          }
        }
      }

      formCfg[field.name] = ['', validators];
    }

    this.form = this.fb.group(formCfg);
  }
}
