import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AppStore} from './store/app.store';

@Component({
  selector: 'app-root',
  template: `
    <section fxFill fxLayout="column" fxLayoutGap="16px">
      <candle-chart fxFlex=""></candle-chart>
      <!--      <app-trade-log fxFlex=""></app-trade-log>-->
      <chart-config fxFlex="100px"></chart-config>
    </section>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {


  constructor(private appStore: AppStore) {
  }

  ngOnInit(): void {
    this.appStore.loadKLine();
    this.appStore.loadTradeLog();
    this.appStore.loadPredictLog();
  }
}
