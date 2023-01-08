import {EntityTradeLog} from "../chart-data/entity.trade-log";
import {buyColor, lossColor, sellColor, winColor} from "../chart-data/chart-colors";

const pointSize = 12;


const markLine = (buyTime, buyPoint, sellTime, sellPoint, profitRate) => ([
  // 坐标点A
  {
    coord: [buyTime, buyPoint],
    lineStyle: {
      color: profitRate > 0 ? winColor : lossColor,
    },
    value: profitRate, // 用于显示在tooltip中
  },
  // //坐标点B
  {
    coord: [sellTime, sellPoint],
  }
])

const buyPointMarker = ({time, buyPoint}) => ({
  symbol: 'circle',
  symbolSize: [pointSize, pointSize],
  coord: [time, buyPoint],
  value: '',
  itemStyle: {
    color: buyColor,
  },
  label: {}
});

const sellPointMarker = ({sellTime, sellPoint}) => ({
  symbol: 'circle',
  symbolSize: [pointSize, pointSize],
  coord: [sellTime, sellPoint],
  value: '',
  itemStyle: {
    color: sellColor,
  },
  label: {}
})

export const markerByTradeLogs = (tradLogs: EntityTradeLog[]) => {
  return tradLogs.reduce((acc, tradeLog) => {

    acc.buyMarkers.push(buyPointMarker({
      time: tradeLog.time,
      buyPoint: tradeLog.buy
    }));

    acc.sellMarkers.push(sellPointMarker({
      sellTime: tradeLog.sellTime,
      sellPoint: tradeLog.sell
    }));
    acc.markLines.push(markLine(
      tradeLog.time,
      tradeLog.buy,
      tradeLog.sellTime,
      tradeLog.sell,
      tradeLog.profitRate
    ));
    return acc;
  }, {
    buyMarkers: [],
    sellMarkers: [],
    markLines: []
  })
}
