import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {AppComponentStore} from "./store/app.store";
import {NgxEchartsModule} from "ngx-echarts";
import {HttpClientModule} from "@angular/common/http";
import {PushModule} from "@ngrx/component";
import {IsNotNilPipeModuleModule} from "./pipes/is-not-nil.pipe.module/is-not-nil.pipe.module.module";
import {TradeLogComponent} from './trade-log/trade-log.component';
import {CandleChartComponent} from './candle-chart/candle-chart.component';
import {NzListModule} from "ng-zorro-antd/list";

@NgModule({
  declarations: [
    AppComponent,
    TradeLogComponent,
    CandleChartComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    PushModule,
    IsNotNilPipeModuleModule,
    NzListModule
  ],
  providers: [AppComponentStore],
  bootstrap: [AppComponent]
})
export class AppModule {
}
