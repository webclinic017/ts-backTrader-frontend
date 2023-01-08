import {Injectable} from '@angular/core';
import {ComponentStore} from "@ngrx/component-store";
import {HttpClient} from "@angular/common/http";
import {concatMap, tap} from "rxjs";
import {EntityEchartKLine} from "./entity.echart-k-line";
import {EntityCandleLink} from "./entity.candle_link";
import produce from "immer";
import {EntityTradeLog} from "../chart-data/entity.trade-log";
import {initOptions} from "../models/echart-options.initial";
import {markerByTradeLogs} from "../utils/markerByTradeLogs.utls";
import {EntityPredictor} from "./entityPredictor";
import {markLineByPredictorLogs} from "../utils/markLineByPredictorLog.util";
import {MarkLineOption} from "echarts/types/dist/shared";


/*初始化状态*/
const initState = {
  initOptions, //初始化图标设置
  options: {
    //变更中图标设置
    xAxis: {
      data: []
    },
    series: [{
      data: [],
      markPoint: {
        data: []
      },
      markLine: {
        data: []
      }
    }]
  },
  tradeLogs: [] as EntityTradeLog[],
  predictorLines: [] as MarkLineOption[],
}

@Injectable()
export class AppComponentStore extends ComponentStore<typeof initState> {
  initOptions$ = this.select(state => state.initOptions);
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
                draft.options.xAxis.data = eChartKline.map(item => item.category);
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
              // console.log(data);
              const {buyMarkers, sellMarkers, markLines} = markerByTradeLogs(data);
              this.patchState(state => produce(state, draft => {
                  draft.tradeLogs = data;
                  draft.options.series.at(0).markPoint.data.push(
                    ...buyMarkers,
                    ...sellMarkers,
                  );
                  draft.options.series.at(0).markLine.data.push(
                    ...markLines
                  );
                })
              )
            })
          );
        }
      )
    )
  });

  // 获取预测记录
  loadPredictLog = this.effect(origin$ => {
    return origin$.pipe(
      concatMap(() => {
          return this.httpClient.get<EntityPredictor[]>('/assets/logs/predictorLogs.json').pipe(
            tap((data) => {
              // console.log(data);
              const predictorLines = markLineByPredictorLogs(data);
              // this.patchState({predictorLines})
              this.patchState(state => produce(state, draft => {
                  draft.predictorLines = predictorLines;
                  draft.options.series.at(0).markLine.data.push(
                    ...predictorLines
                  );
                })
              )
            })
          );
        }
      )
    )
  })


  constructor(private httpClient: HttpClient) {
    super(initState);
  }


}
