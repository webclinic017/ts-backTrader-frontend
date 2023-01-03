import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {AppComponentStore} from "./store/app.store";
import {NgxEchartsModule} from "ngx-echarts";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [AppComponentStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
