import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HighlightRoutingModule } from './highlight-routing.module';
import { HighlightComponent } from './highlight.component';
import { FormsModule } from '@angular/forms';
import { HighlightNavComponent } from './highlight-nav/highlight-nav.component';
import { HighlightSelectorComponent } from './highlight-selector/highlight-selector.component';
import { HighlightCorrectComponent } from './highlight-correct/highlight-correct.component';
import { HighlightMainComponent } from './highlight-main/highlight-main.component';

@NgModule({
  declarations: [
    HighlightComponent,
    HighlightNavComponent,
    HighlightSelectorComponent,
    HighlightCorrectComponent,
    HighlightMainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HighlightRoutingModule
  ]
})
export class HighLightModule { }
