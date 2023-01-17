import {MarkLine2DDataItemOption} from 'echarts/types/src/component/marker/MarkLineModel';
import {EMarkLineType} from '../models/mark-line.type';
import {MarkLineSize} from '../models/mark-line.size';
import {lossColor, winColor} from '../chart-data/chart-colors';

export const markLineOfTradeLog = (buyTime, buyPoint, sellTime, sellPoint, profitRate): MarkLine2DDataItemOption => ([
  // 坐标点A
  {
    coord: [buyTime, buyPoint],
    type: EMarkLineType.trade_log as any,
    lineStyle: {
      width: MarkLineSize,
      color: profitRate > 0 ? winColor : lossColor,
    },
    value: profitRate, // 用于显示在tooltip中
  },
  //坐标点B
  {
    coord: [sellTime, sellPoint],
  },
]);
