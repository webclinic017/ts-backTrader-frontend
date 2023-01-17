import {Injectable} from '@angular/core';
import {ComponentStore} from '@ngrx/component-store';
import {HttpClient} from '@angular/common/http';
import {concatMap, tap} from 'rxjs';
import {EntityEchartKLine} from './entity.echart-k-line';
import {EntityCandleLink} from './entity.candle_link';
import produce from 'immer';
import {EntityTradeLog} from '../chart-data/entity.trade-log';
import {initOptions} from '../models/echart-options.initial';
import {markerByTradeLogs} from '../utils/markerByTradeLogs.utls';
import {EntityPredictor} from './entityPredictor';
import {markLineOfPredictorLogs} from '../utils/markLineOfPredictorLog.util';
import {ECBasicOption, MarkLineOption} from 'echarts/types/dist/shared';
import {ECharts, EChartsType} from 'echarts';
import {MarkPointDataItemOption} from 'echarts/types/src/component/marker/MarkPointModel';
import {EMarkPointType, TradeMarkPointType} from '../models/mark-point.type';
import {MarkLine2DDataItemOption} from 'echarts/types/src/component/marker/MarkLineModel';
import {EMarkLineType, TradeMarkLineType} from '../models/mark-line.type';
import {MarkLineSize} from '../models/mark-line.size';


/*初始化状态*/
const initState = {
  initOptions, //初始化图标设置
  options: {
    //变更中图标设置
    xAxis: {
      data: [],
    },
    series: [{
      data: [],
      markPoint: {
        data: [],
      },
      markLine: {
        data: [],
      },
    }],
  },
  tradeLogs: [] as EntityTradeLog[],
  predictorLines: [] as MarkLineOption[],
  configs: {
    showTradeLog: true,
  },
};

type tState = typeof initState;

@Injectable()
export class AppStore extends ComponentStore<tState> {
  initOptions$ = this.select(state => state.initOptions);
  echartOptions$ = this.select(state => state.options);
  configs$ = this.select(state => state.configs);
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
                  parseFloat(item['high']),
                ],
              }));
              console.log(eChartKline);
              this.patchState(state => produce(state, draft => {
                draft.options.xAxis.data = eChartKline.map(item => item.category);
                draft.options.series.at(0).data = eChartKline.map(item => item.data);
              }));
            }),
          );
        },
      ),
    );
  });
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
                    ...markLines,
                  );
                }),
              );
            }),
          );
        },
      ),
    );
  });
  // 获取预测记录
  loadPredictLog = this.effect(origin$ => {
    return origin$.pipe(
      concatMap(() => {
          return this.httpClient.get<EntityPredictor[]>('/assets/logs/predictorLogs.json').pipe(
            tap((data) => {
              // console.log(data);
              const predictorLines = markLineOfPredictorLogs(data);
              // this.patchState({predictorLines})
              this.patchState(state => produce(state, draft => {
                  draft.predictorLines = predictorLines;
                  draft.options.series.at(0).markLine.data.push(
                    ...predictorLines,
                  );
                }),
              );
            }),
          );
        },
      ),
    );
  });

  private readonly horizontalMoveSize = 1 / 2; //水平方向移动尺寸
  private readonly verticalMoveSize = 4; //垂直方向移动尺寸
  //图表实例引用
  private chartRef: ECharts;

  constructor(private httpClient: HttpClient) {
    super(initState);
  }

  // 变更配置项
  modifyConfig(partyConfig: Partial<tState['configs']>) {
    this.patchState(state => produce(state, draft => {
      draft.configs = {
        ...draft.configs,
        ...partyConfig,
      };
    }));
    // this.toggleTradeLog();
  }

  initChart($event: EChartsType) {
    this.chartRef = $event;
    // 监听鼠标移入显示预测点
    this.registerMouseHover();
    //   监听鼠标移除,隐藏预测点
    this.registerMouseLeave();
  }

  // 移动图表到左边
  moveChartLeft() {
    const option = this.chartRef.getOption();
    const start = option['dataZoom'][0].start;
    const end = option['dataZoom'][0].end;
    const distance = end - start;

    this.chartRef.dispatchAction(
      {
        type: 'dataZoom',
        start: start - this.horizontalMoveSize > 0 ? start - this.horizontalMoveSize : 0,
        end: start - this.horizontalMoveSize > 0 ? end - this.horizontalMoveSize : distance,
      },
    );

  }

  // 移动图表到右边
  moveChartRight() {
    const option = this.chartRef.getOption();
    const start = option['dataZoom'][0].start;
    const end = option['dataZoom'][0].end;
    const distance = end - start;

    this.chartRef.dispatchAction(
      {
        type: 'dataZoom',
        start: end + this.horizontalMoveSize < 100 ? start + this.horizontalMoveSize : 100 - distance,
        end: end + this.horizontalMoveSize < 100 ? end + this.horizontalMoveSize : 100,
      },
    );
  }

  // 放大图表
  scaleChartLarge() {
    const option = this.chartRef.getOption();
    const startValue = option['dataZoom'][0].startValue;
    const endValue = option['dataZoom'][0].endValue;
    const scaleDistance = endValue - startValue;
    const distSize = (scaleDistance <= (this.verticalMoveSize * 2)) ? 1 : this.verticalMoveSize;
    const distStartValue = startValue + (scaleDistance > 0 ? distSize : 0);
    const distEndValue = (endValue - distSize) > distStartValue ? (endValue - distSize) : distStartValue;
    console.log(distStartValue, distEndValue);
    this.chartRef.dispatchAction(
      {
        type: 'dataZoom',
        startValue: distStartValue,
        endValue: distEndValue,
      },
    );
  }

  // 缩小图表
  scaleChartSmall() {
    const option = this.chartRef.getOption();
    const maxSize = option['series'][0].data.length;
    console.log(maxSize);
    const startValue = option['dataZoom'][0].startValue;
    const endValue = option['dataZoom'][0].endValue;
    const scaleDistance = endValue - startValue;
    const distSize = (scaleDistance <= (this.verticalMoveSize * 2)) ? 1 : this.verticalMoveSize;
    const distStartValue = startValue - distSize > 0 ? startValue - distSize : 0;
    const distEndValue = endValue + distSize > maxSize ? maxSize : endValue + distSize;
    console.log(distStartValue, distEndValue);
    this.chartRef.dispatchAction(
      {
        type: 'dataZoom',
        startValue: distStartValue,
        endValue: distEndValue,
      },
    );
  }

  // 隐藏||显示, 交易记录MarkPoint|MarkLine
  toggleTradeLogVisible($event: boolean) {
    const options = this.chartRef.getOption();
    const {markPoint, markLine} = options['series'][0];
    /*买卖单*/
    markPoint.data.forEach((item: MarkPointDataItemOption) => {
      // 如果不是买卖点,就排除
      if (!TradeMarkPointType.includes(item.type as EMarkPointType)) {
        return;
      }
      item.symbol = $event ? 'circle' : 'none';
    });
    /*交易线*/
    markLine.data.forEach((item: MarkLine2DDataItemOption) => {
      let _item;
      if (Array.isArray(item) && item.length > 0) {
        _item = item[0];
      } else {
        _item = item;
      }

      // 如果不是买卖点,就排除
      if (!TradeMarkLineType.includes(_item.type as EMarkLineType)) {
        return;
      }
      _item.lineStyle.width = $event ? MarkLineSize : 0;
    });

    this.chartRef.setOption(options);
  }


  // 鼠标移入显示预测点
  private registerMouseHover() {
    this.chartRef.on('mousemove', (params) => {
      if (params.componentType !== 'series') {
        return;
      }
      console.log(this.registerMouseHover.name, params.name);

      /*
      * 将对应时间的预测点,显示出来
      * 1.获取options数据,
      * 2.获取hover数据时间,
      * 3. 在options -> series -> markLine -> data -> name中,找到对应的时间
      * 4. 将对应的markLine -> data -> lineStyle->width 设置1
      * 5, 更新options
      */
      const option: ECBasicOption = this.chartRef.getOption();
      const candleTime = params.name;
      const indexes = option['series'][0]['markLine']['data'].reduce((pre, cur, index) => {
        if (cur.name === candleTime) {
          pre.push(index);
        }
        return pre;
      }, []);
      console.log(this.registerMouseHover.name, indexes);
      indexes.forEach(index => {
        if (index === -1!) {
          return;
        }
        option['series'][0]['markLine']['data'][index]['lineStyle']['width'] = 2;
        this.chartRef.setOption(option);
      });
    });
  }

  // 鼠标移出,隐藏预测点
  private registerMouseLeave() {
    this.chartRef?.on('mouseout', params => {
      if (params.componentType !== 'series') {
        return;
      }
      console.log(this.registerMouseLeave.name, params.name);
      const option: ECBasicOption = this.chartRef.getOption();
      const candleTime = params.name;
      const indexes = option['series'][0]['markLine']['data'].reduce((pre, cur, index) => {
          if (cur.name === candleTime) {
            pre.push(index);
          }
          return pre;
        }
        , []);
      console.log('registerMouseLeave', indexes);
      indexes.forEach(index => {
        if (index === -1) {
          return;
        }
        option['series'][0]['markLine']['data'][index]['lineStyle']['width'] = 0;
        this.chartRef.setOption(option);
      });
    });
  }
}
