import {Injectable} from '@angular/core';
import {ComponentStore} from "@ngrx/component-store";
import {HttpClient} from "@angular/common/http";
import {concatMap, tap} from "rxjs";
import {EntityEchartKLine} from "./entity.echart-k-line";
import {EntityCandleLink} from "./entity.candle_link";
import {EChartsOption} from "echarts";
import produce from "immer";
import {tradeLogData} from "../chart-data/utils/trade-log.data";
import {EntityTradeLog} from "../chart-data/entity.trade-log";
import {sellPointMaker} from "../chart-data/utils/sell-point.maker";
import {buyPointMaker} from "../chart-data/utils/buy-point.maker";


interface State {
  options: EChartsOption,
}

const initState: State = {
  options: {
    xAxis: {
      data: []
    },
    series: [{
      data: [],
      markPoint: {
        data: []
      }
    }]
  },
}

@Injectable()
export class AppComponentStore extends ComponentStore<State> {
  echartOptions$ = this.select(state => state.options);
  // 获取K线数据
  loadKLine = this.effect(origin$ => {
    return origin$.pipe(
      concatMap(() => {
          return this.httpClient.get<EntityCandleLink[]>('/assets/kline-data/chuangye_eft.json').pipe(
            tap((data: EntityCandleLink[]) => {
              const eChartKline: EntityEchartKLine[] = data.map((item: EntityCandleLink) => ({
                category: item.time.split(',')[0], //把'星期'去掉
                data: [
                  parseFloat(item['open']),
                  parseFloat(item['close']),
                  parseFloat(item['low']),
                  parseFloat(item['high'])
                ]
              }))
              console.log(eChartKline);
              this.patchState(state => produce(state, draft => {
                // @ts-ignore
                draft.options.xAxis.data = eChartKline.map(item => item.category);
                // @ts-ignore
                draft.options.series.at(0).data = eChartKline.map(item => item.data);
              }))
            })
          );
        }
      )
    )
  })
  // 获取交易数据
  loadTradeLog = this.effect(origin$ => {
    return origin$.pipe(
      concatMap(() => {
          return this.httpClient.get<EntityTradeLog[]>('/assets/logs/tradeLogs.json').pipe(
            tap((data) => {
              const tradeLogs = tradeLogData(data)
              const buyMarkers = buyPointMaker(tradeLogs);
              const sellMarkers = sellPointMaker(tradeLogs);
              console.log(data);
              this.patchState(state => produce(state, draft => {
                  // @ts-ignore
                  draft.options.series.at(0).markPoint.data.push(
                    ...buyMarkers,
                    ...sellMarkers,
                  );
                })
              )
            })
          );
        }
      )
    )
  });


  constructor(private httpClient: HttpClient) {
    super(initState);
  }


}
