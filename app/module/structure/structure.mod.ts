import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { Extensions_Mod } from 'lm/extensions';
import {
  //Components
  Copy_Cmp,
  DataTable_Cmp,
  Form_Cmp,
  FormField_Cmp,
  Hero_Cmp,
  StructureBuilder_Cmp,
  Ribbon_Cmp,
  TextImage_Cmp,
  TileSet_Cmp,

  //Services
  Renderer_Svc
} from 'lm/structure';
import { Asset_Svc, GlobalEvent_Svc, GoogleMap_Svc } from 'lm/site-common';

@NgModule({
  declarations: [
    Copy_Cmp,
    DataTable_Cmp,
    FormField_Cmp,
    Form_Cmp,
    Hero_Cmp,
    StructureBuilder_Cmp,
    Ribbon_Cmp,
    TextImage_Cmp,
    TileSet_Cmp
  ],
  entryComponents: [
    Copy_Cmp,
    DataTable_Cmp,
    Form_Cmp,
    Hero_Cmp,
    Ribbon_Cmp,
    TextImage_Cmp,
    TileSet_Cmp
  ],
  exports: [
    StructureBuilder_Cmp
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule,
    Extensions_Mod
  ],
  providers: [
    Asset_Svc,
    GlobalEvent_Svc,
    GoogleMap_Svc,
    Renderer_Svc
  ]
})

export class Structure_Mod {
}