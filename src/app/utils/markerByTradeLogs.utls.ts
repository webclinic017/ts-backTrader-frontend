import {EntityTradeLog} from '../chart-data/entity.trade-log';
import {markLineOfTradeLog} from './markLineOfTradeLog.util';
import {sellPointMarker} from './markPointOfSell.util';
import {buyPointMarker} from './markPointOfBuy.util';


export const markerByTradeLogs = (tradLogs: EntityTradeLog[]) => {
  return tradLogs.reduce((acc, tradeLog) => {

    acc.buyMarkers.push(buyPointMarker({
      time: tradeLog.time,
      buyPoint: tradeLog.buy,
    }));

    acc.sellMarkers.push(sellPointMarker({
      sellTime: tradeLog.sellTime,
      sellPoint: tradeLog.sell,
    }));
    acc.markLines.push(markLineOfTradeLog(
      tradeLog.time,
      tradeLog.buy,
      tradeLog.sellTime,
      tradeLog.sell,
      tradeLog.profitRate,
    ));
    return acc;
  }, {
    buyMarkers: [],
    sellMarkers: [],
    markLines: [],
  });
};
