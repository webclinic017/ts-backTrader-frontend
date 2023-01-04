/*
* 交易记录数据
* */


import {EntityTradeLog} from "../entity.trade-log";

export interface EntityTradeLogData {
  buyLogs: [string, number][]; //[time,buyPoint]
  sellLogs: [string, number][]; //[time,sellPoint]
}

export const tradeLogData = (TradeLogs: EntityTradeLog[]) => TradeLogs.reduce(
  (acc, cur) => {
    acc.buyLogs.push([cur.time, cur.buy]);
    acc.sellLogs.push([cur.sellTime, cur.sell]);
    return acc;
  }
  , <EntityTradeLogData>{
    buyLogs: [],
    sellLogs: [],
  });
