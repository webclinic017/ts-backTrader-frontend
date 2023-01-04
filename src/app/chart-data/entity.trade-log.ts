import { EntityPosition } from './entity.position';

export interface EntityTradeLog extends EntityPosition {
  time: string; //建仓时间
  buy: number;//买入点位
  sell: number; //卖出点位
  sellTime: string;//卖出时间
  profitPoint: number;//盈利点位
  profitRate: number;//盈利百分比
  profitMoney: number;//盈利金额
  holdDays: number;//持仓天数
}
