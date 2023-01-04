/*
* 卖出点,标记点
* */


import {EntityTradeLogData} from "./trade-log.data";
import {MarkPointOption} from "echarts/types/dist/shared";

export const sellPointMaker = ({sellLogs}: EntityTradeLogData) => {
  return sellLogs.map((sellLog): MarkPointOption => ({
    symbolSize: [30, 30],
    // @ts-ignore
    coord: [...sellLog],
    value: sellLog.at(-1),
    itemStyle: {
      color: 'rgb(238, 102, 102)',
      // opacity: 0.85,
    },
    label: {
      // offset: [0, 6],
    }
  }));
};
