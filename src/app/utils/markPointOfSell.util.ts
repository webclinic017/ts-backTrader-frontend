import {MarkPointDataItemOption} from 'echarts/types/src/component/marker/MarkPointModel';
import {markPoinSize} from '../models/mark-poin.size';
import {EMarkPointType} from '../models/mark-point.type';
import {sellColor} from '../chart-data/chart-colors';

export const sellPointMarker = ({sellTime, sellPoint}): MarkPointDataItemOption => ({
  symbol: 'circle',
  symbolSize: [markPoinSize, markPoinSize],
  coord: [sellTime, sellPoint],
  value: sellPoint,
// @ts-ignore 自定义markPoint的类型
  type: EMarkPointType.sellPoint,
  itemStyle: {
    color: sellColor,
  },
  label: {
    show: false,
  },
});
