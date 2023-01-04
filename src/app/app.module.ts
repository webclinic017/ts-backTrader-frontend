import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {AppComponentStore} from "./store/app.store";
import {NgxEchartsModule} from "ngx-echarts";
import {HttpClientModule} from "@angular/common/http";
import {PushModule} from "@ngrx/component";
import {IsNotNilPipeModuleModule} from "./pipes/is-not-nil.pipe.module/is-not-nil.pipe.module.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    PushModule,
    IsNotNilPipeModuleModule
  ],
  providers: [AppComponentStore],
  bootstrap: [AppComponent]
})
export class AppModule {
}
