import { getAxiosInstance } from '../../utils/http';
import { TimeBucket } from '../../utils/time';
import { DataApiPriceResponse } from './types';

const http = getAxiosInstance(
  'https://data.beefy.finance/api/v2',
  process.env['DATA_API_KEY'] || ''
);

export const getDataApiPrices = async (oracle: string, bucket: TimeBucket) => {
  try {
    const response = await http.get<DataApiPriceResponse>(`/prices`, {
      params: {
        oracle,
        bucket,
      },
    });
    return response.data.map(priceRow => ({
      ts: priceRow.t,
      value: priceRow.v.toString(),
    }));
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};
