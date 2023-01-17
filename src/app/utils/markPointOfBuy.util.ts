import {MarkPointDataItemOption} from 'echarts/types/src/component/marker/MarkPointModel';
import {markPoinSize} from '../models/mark-poin.size';
import {EMarkPointType} from '../models/mark-point.type';
import {buyColor} from '../chart-data/chart-colors';

export const buyPointMarker = ({time, buyPoint}): MarkPointDataItemOption => ({
  symbol: 'circle',
  symbolSize: [markPoinSize, markPoinSize],
  coord: [time, buyPoint],
  value: buyPoint,
// @ts-ignore 自定义markPoint的类型
  type: EMarkPointType.buyPoint,
  label: {
    show: false,
  },
  itemStyle: {
    color: buyColor,
  },
});
