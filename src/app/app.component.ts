import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AppComponentStore} from "./store/app.store";

@Component({
  selector: 'app-root',
  template: `
    <section fxFill fxLayout="row" fxLayoutGap="16px">
      <candle-chart fxFlex=""></candle-chart>
      <!--      <app-trade-log fxFlex=""></app-trade-log>-->
    </section>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {


  constructor(private appStore: AppComponentStore) {
  }

  ngOnInit(): void {
    this.appStore.loadKLine();
    this.appStore.loadTradeLog();
    this.appStore.loadPredictLog()
  }
}
