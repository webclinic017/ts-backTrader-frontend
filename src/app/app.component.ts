import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {EChartsOption} from 'echarts';
import {AppComponentStore} from "./store/app.store";
import {downBorderColor, downColor, upBorderColor, upColor} from "./chart-data/chart-colors";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  initOptions: EChartsOption = {
    title: {
      text: '上证指数',
      left: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    // legend: {
    //   data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
    // },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%'
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
        markPoint: {
          label: {
            formatter: function (param: any) {
              return param != null ? param.value + '' : '';
            }
          },
          data: [],
          tooltip: {
            formatter: function (param: any) {
              return param.name + '<br>' + (param.data.coord || '');
            }
          }
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            // [
            //   {
            //     name: 'from lowest to highest',
            //     type: 'min',
            //     valueDim: 'lowest',
            //     symbol: 'circle',
            //     symbolSize: 10,
            //     label: {
            //       show: false
            //     },
            //     emphasis: {
            //       label: {
            //         show: false
            //       }
            //     }
            //   },
            //   {
            //     type: 'max',
            //     valueDim: 'highest',
            //     symbol: 'circle',
            //     symbolSize: 10,
            //     label: {
            //       show: false
            //     },
            //     emphasis: {
            //       label: {
            //         show: false
            //       }
            //     }
            //   }
            // ],
            // {
            //   name: 'min line on close',
            //   type: 'min',
            //   valueDim: 'close'
            // },
            // {
            //   name: 'max line on close',
            //   type: 'max',
            //   valueDim: 'close'
            // }
          ]
        }
      },
      // {
      //   name: 'MA5',
      //   type: 'line',
      //   data: calculateMA(5, data0),
      //   smooth: true,
      //   lineStyle: {
      //     opacity: 0.5
      //   }
      // },
      // {
      //   name: 'MA10',
      //   type: 'line',
      //   data: calculateMA(10, data0),
      //   smooth: true,
      //   lineStyle: {
      //     opacity: 0.5
      //   }
      // },
      // {
      //   name: 'MA20',
      //   type: 'line',
      //   data: calculateMA(20, data0),
      //   smooth: true,
      //   lineStyle: {
      //     opacity: 0.5
      //   }
      // },
      // {
      //   name: 'MA30',
      //   type: 'line',
      //   data: calculateMA(30, data0),
      //   smooth: true,
      //   lineStyle: {
      //     opacity: 0.5
      //   }
      // }
    ]
  };
  echartOptions$ = this.store.echartOptions$;

  constructor(private store: AppComponentStore) {
  }

  ngOnInit(): void {
    this.store.loadKLine();
    this.store.loadTradeLog();
  }
}
