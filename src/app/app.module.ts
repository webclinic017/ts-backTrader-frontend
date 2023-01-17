import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AppStore} from './store/app.store';
import {NgxEchartsModule} from 'ngx-echarts';
import {HttpClientModule} from '@angular/common/http';
import {PushModule} from '@ngrx/component';
import {IsNotNilPipeModuleModule} from './pipes/is-not-nil.pipe.module/is-not-nil.pipe.module.module';
import {TradeLogComponent} from './trade-log/trade-log.component';
import {CandleChartComponent} from './candle-chart/candle-chart.component';
import {NzListModule} from 'ng-zorro-antd/list';
import {ChartConfigComponent} from './chart-config/chart-config.component';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {FormsModule} from '@angular/forms';
import {NzFormModule} from 'ng-zorro-antd/form';

@NgModule({
  declarations: [
    AppComponent,
    TradeLogComponent,
    CandleChartComponent,
    ChartConfigComponent,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    PushModule,
    IsNotNilPipeModuleModule,
    NzListModule,
    NzSwitchModule,
    FormsModule,
    NzFormModule,
  ],
  providers: [AppStore],
  bootstrap: [AppComponent],
})
export class AppModule {
}
