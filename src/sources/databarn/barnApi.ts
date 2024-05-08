import axios from 'axios';
import {
  DatabarnPriceResponse,
  DatabarnPriceType,
  DatabarnProductType,
  DatabarnTimelineResponse,
} from './types';
import { TimeBucket } from '../../utils/time';

const BASE_URL = 'https://databarn.beefy.finance/api/v1';

export const getDataBarnTimeline = async (address: string) => {
  try {
    const response = await axios.get<DatabarnTimelineResponse>(
      BASE_URL + '/beefy/timeline?address=' + address
    );
    return response.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        return [];
      }
    }
    throw err;
  }
};

export const getDataBarnPrice = async (
  chain: string,
  productType: DatabarnProductType,
  address: string,
  bucket: TimeBucket,
  priceType: DatabarnPriceType
) => {
  try {
    const response = await axios.get<DatabarnPriceResponse>(
      `${BASE_URL}/price?product_key=beefy:${productType}:${chain}:${address}&price_type=${priceType}&time_bucket=${bucket}`
    );
    return response.data.map(price => ({
      ts: Math.floor(new Date(price[0]).getTime() / 1000),
      value: price[1],
    }));
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};
