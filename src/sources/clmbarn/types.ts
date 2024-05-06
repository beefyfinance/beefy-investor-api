export interface CLMTimelineAnalyticsConfig {
  datetime: string;
  product_key: string;
  display_name: string;
  chain: string;
  is_eol: boolean;
  is_dashboard_eol: boolean;
  transaction_hash: string;
  token0_to_usd: string;
  token1_to_usd: string;
  share_balance: string;
  underlying0_balance: string;
  underlying1_balance: string;
  usd_balance: string;
  share_diff: string;
  underlying_diff0: string;
  underlying_diff1: string;
  usd_diff: string;
}

export type CLMAnalyticsUserTimelineResponse = CLMTimelineAnalyticsConfig[];