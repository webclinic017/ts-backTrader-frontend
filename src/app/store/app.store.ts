import {Injectable} from '@angular/core';
import {ComponentStore} from "@ngrx/component-store";
import {HttpClient} from "@angular/common/http";
import {concatMap, tap} from "rxjs";
import {EntityEchartKLine} from "./entity.echart-k-line";
import {EntityCandleLink} from "./entity.candle_link";
import {EChartsOption} from "echarts";
import {downBorderColor, downColor, upBorderColor, upColor} from "../chart-data/chart-colors";
import produce from "immer";


interface State {
  options: EChartsOption,
  kLine: Array<EntityEchartKLine>
}

const initState: State = {
  options: {
    title: {
      text: '上证指数',
      left: 0
    },
    xAxis: {
      type: 'category',
      data: [],
      boundaryGap: false,
      axisLine: {onZero: false},
      splitLine: {show: false},
      min: 'dataMin',
      max: 'dataMax'
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 50,
        end: 100
      },
      {
        show: true,
        type: 'slider',
        top: '90%',
        start: 50,
        end: 100
      }
    ],
    series: [
      {
        name: '日K',
        type: 'candlestick',
        data: [],
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upBorderColor,
          borderColor0: downBorderColor
        },
        // markPoint: {
        //   label: {
        //     formatter: function (param: any) {
        //       return param != null ? Math.round(param.value) + '' : '';
        //     }
        //   },
        //   data: [
        //     {
        //       name: 'Mark',
        //       coord: ['2013/5/31', 2300],
        //       value: 2300,
        //       itemStyle: {
        //         color: 'rgb(41,60,85)'
        //       }
        //     },
        //     {
        //       name: 'highest value',
        //       type: 'max',
        //       valueDim: 'highest'
        //     },
        //     {
        //       name: 'lowest value',
        //       type: 'min',
        //       valueDim: 'lowest'
        //     },
        //     {
        //       name: 'average value on close',
        //       type: 'average',
        //       valueDim: 'close'
        //     }
        //   ],
        //   tooltip: {
        //     formatter: function (param: any) {
        //       return param.name + '<br>' + (param.data.coord || '');
        //     }
        //   }
        // },
        // markLine: {
        //   symbol: ['none', 'none'],
        //   data: [
        //     [
        //       {
        //         name: 'from lowest to highest',
        //         type: 'min',
        //         valueDim: 'lowest',
        //         symbol: 'circle',
        //         symbolSize: 10,
        //         label: {
        //           show: false
        //         },
        //         emphasis: {
        //           label: {
        //             show: false
        //           }
        //         }
        //       },
        //       {
        //         type: 'max',
        //         valueDim: 'highest',
        //         symbol: 'circle',
        //         symbolSize: 10,
        //         label: {
        //           show: false
        //         },
        //         emphasis: {
        //           label: {
        //             show: false
        //           }
        //         }
        //       }
        //     ],
        //     {
        //       name: 'min line on close',
        //       type: 'min',
        //       valueDim: 'close'
        //     },
        //     {
        //       name: 'max line on close',
        //       type: 'max',
        //       valueDim: 'close'
        //     }
        //   ]
        // }
      }
    ]
  },
  kLine: []
}

@Injectable()
export class AppComponentStore extends ComponentStore<State> {
  echartOptions$ = this.select(state => state.options);

  /*
  * 执行一下行为
  * 1.获取k线数据,
  * 2.获取交易日志数据
  * 3.并把交易日志,展示出来
  *   * */
  loadKLine = this.effect(origin$ => {
    return origin$.pipe(
      concatMap(() => {
          return this.httpClient.get<EntityCandleLink[]>('/assets/kline-data/chuangye_eft.json').pipe(
            tap((data: EntityCandleLink[]) => {
              // console.log(data);
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

  constructor(private httpClient: HttpClient) {
    super(initState);
  }


}
