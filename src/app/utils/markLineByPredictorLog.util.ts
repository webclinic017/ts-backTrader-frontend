import {EntityPredictor} from "../store/entityPredictor";
import {buyColor, sellColor} from "../chart-data/chart-colors";

export const markLineByPredictorLogs = (predictorLogs: EntityPredictor[]) => {
  return predictorLogs.reduce((pre, cur) => {
    if (cur.buyPrice) {
      pre.push({
        name: cur.cTime,
        yAxis: cur.buyPrice,
        type: 'predictor_buy',
        emphasis: {
          disable: true
        },
        lineStyle: {
          color: buyColor,
          width: 0,
        }
      });
    }
    if (cur.sellPrice) {
      pre.push({
        name: cur.cTime,
        yAxis: cur.sellPrice,
        type: 'predictor_sell',
        emphasis: {
          disable: true
        },
        lineStyle: {
          color: sellColor,
          width: 0,
        }
      });
    }
    return pre;
  }, []);
}
