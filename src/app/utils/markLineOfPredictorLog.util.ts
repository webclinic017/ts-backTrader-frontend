import {EntityPredictor} from '../store/entityPredictor';
import {buyColor, sellColor} from '../chart-data/chart-colors';
import {EMarkLineType} from '../models/mark-line.type';

export const markLineOfPredictorLogs = (predictorLogs: EntityPredictor[]) => {
  return predictorLogs.reduce((pre, cur) => {
    if (cur.buyPrice) {
      pre.push({
        name: cur.cTime,
        yAxis: cur.buyPrice,
        type: EMarkLineType.predictor_buy,
        emphasis: {
          disable: true,
        },
        lineStyle: {
          color: buyColor,
          width: 0,
        },
      });
    }
    if (cur.sellPrice) {
      pre.push({
        name: cur.cTime,
        yAxis: cur.sellPrice,
        type: EMarkLineType.predictor_sell,
        emphasis: {
          disable: true,
        },
        lineStyle: {
          color: sellColor,
          width: 0,
        },
      });
    }
    return pre;
  }, []);
};
