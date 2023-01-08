import {Component, OnInit} from '@angular/core';
import {AppComponentStore} from "../store/app.store";

@Component({
  selector: 'app-trade-log',
  template: `
    <section class="list-container" fxFill>
      <nz-list nzBordered>
        <nz-list-header>交易记录</nz-list-header>
        <nz-list-item>
          <span> 买入时间</span>
          <span> 买入价格</span>
          <span> 卖出时间</span>
          <span> 卖出价格</span>
          <span> 收益比</span>
          <span> 持仓天数</span>
        </nz-list-item>
        <nz-list-item *ngFor="let tradeLog of tradeLogs$|ngrxPush;trackBy:trackByTimeAndBuyAndSellAndSellTime">
          <span>{{tradeLog.time}} </span>
          <b> {{tradeLog.buy}}</b>
          <span>{{tradeLog.sellTime}}</span>
          <b>{{tradeLog.sell}}</b>
          <span> {{ (tradeLog.profitRate * 100).toFixed(2)}}%</span>
          <b>{{tradeLog.holdDays}}</b>
        </nz-list-item>

      </nz-list>
    </section>
  `,
  styles: [
    `
      host {
        display: block;
      }
      
      .list-container {
        overflow: auto;
      }
    `
  ]
})
export class TradeLogComponent implements OnInit {
  tradeLogs$ = this.appStore.select(state => state.tradeLogs);

  constructor(private appStore: AppComponentStore) {
  }

  trackByTimeAndBuyAndSellAndSellTime = (_, item) => {
    return `${item.time}_${item.buy}_${item.sellTime}_${item.sell}`
  };

  ngOnInit(): void {
  }

}
