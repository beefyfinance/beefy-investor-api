interface TimelineAnalyticsConfig {
  datetime: string;
  product_key: string;
  display_name: string;
  chain: string;
  is_eol: boolean;
  is_dashboard_eol: boolean;
  transaction_hash: string;
  share_balance: number;
  share_diff: number;
  share_to_underlying_price: number;
  underlying_balance: number;
  underlying_diff: number;
  underlying_to_usd_price: number | null;
  usd_balance: number | null;
  usd_diff: number | null;
}

export type DatabarnTimelineResponse = TimelineAnalyticsConfig[];

interface PriceAnalyticsConfig {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
  '4': string;
}

export type DatabarnPriceResponse = PriceAnalyticsConfig[];

export enum DatabarnProduct {
  vault,
  boost,
}
export type DatabarnProductType = keyof typeof DatabarnProduct;
export const allDatabarnProductTypes = Object.keys(DatabarnProduct);

export enum DatabarnPrice {
  share_to_underlying,
  underlying_to_usd,
}
export type DatabarnPriceType = keyof typeof DatabarnPrice;
export const allDatabarnPriceTypes = Object.keys(DatabarnPrice);
