import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { Extensions_Mod } from 'lm/extensions';
import {
  //Components
  ContentToggle_Cmp,
  Copy_Cmp,
  DataTable_Cmp,
  EcwidStore_Cmp,
  Form_Cmp,
  FormField_Cmp,
  Hero_Cmp,
  StructureBuilder_Cmp,
  Ribbon_Cmp,
  TextImage_Cmp,
  TileSet_Cmp,

  //Services
  ContentToggle_Svc,
  Renderer_Svc,
} from 'lm/structure';
import { Asset_Svc, GlobalEvent_Svc, GoogleMap_Svc } from 'lm/site-common';

@NgModule({
  declarations: [
    ContentToggle_Cmp,
    Copy_Cmp,
    DataTable_Cmp,
    EcwidStore_Cmp,
    FormField_Cmp,
    Form_Cmp,
    Hero_Cmp,
    StructureBuilder_Cmp,
    Ribbon_Cmp,
    TextImage_Cmp,
    TileSet_Cmp
  ],
  entryComponents: [
    ContentToggle_Cmp,
    Copy_Cmp,
    DataTable_Cmp,
    EcwidStore_Cmp,
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
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    Extensions_Mod
  ],
  providers: [
    Asset_Svc,
    ContentToggle_Svc,
    GlobalEvent_Svc,
    GoogleMap_Svc,
    Renderer_Svc
  ]
})
export class Structure_Mod {
}
