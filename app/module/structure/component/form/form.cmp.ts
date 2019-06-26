import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { throwError, timer } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import {
  App_Const,
  Asset_Svc,
  GlobalEvent_Svc,
  Localization_Svc
} from 'lm/site-common';
import { StructureBase_Cmp } from 'lm/structure';

const fieldTypes = {
  text: 'text',
  textarea: 'textarea',
  select: 'select',
};

@Component({
  selector: 'lm-form',
  template: require('./form.cmp.html'),
  styles: [require('./form.cmp.scss')]
})
export class Form_Cmp extends StructureBase_Cmp implements OnInit {
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
    this.onConfigChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.buildFormGroup.bind(this));
  }

  /**
   * OnInit Interface Method
   */
  public ngOnInit() {
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
          return throwError(err);
        }))
        .subscribe(
          result => {
            if (this.content.notification
              && this.content.notification.success
              && this.content.notification.success.text) {
              this.successMessage = this.content.notification.success.text;

              if (this.config.notificationDisplayTime) {
                timer(this.config.notificationDisplayTime)
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
                timer(this.config.notificationDisplayTime)
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
          // Standard validators
          if (key === 'required' || key === 'email') {
            validators.push(Validators[key]);
          }
          // Factory validators
          else {
            validators.push(Validators[key](field.validators[key]));
          }
        }
      }

      let value = undefined;
      let defaultIsDisabled = false;

      if (field.type === fieldTypes.select) {
        const defaultOption = (field.options || []).find(option => option.default);

        if (defaultOption) {
          value = defaultOption.value;
          defaultIsDisabled = defaultOption.disabled;
        }
      }

      formCfg[field.name] = [value, validators];
    }

    this.form = this.fb.group(formCfg);
  }
}
