/*交易策略对象*/
export interface EntityPredictor {
  cTime: string; //当前交易策略的创建时间
  buyPrice?: number;
  sellPrice?: number;
}
