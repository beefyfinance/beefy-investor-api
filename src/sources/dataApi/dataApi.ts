import axios from 'axios';
import { TimeBucket } from '../../utils/time';
import { DataApiPriceResponse } from './types';

const BASE_URL = 'https://data.beefy.finance/api/v2';

export const getDataApiPrices = async (oracle: string, bucket: TimeBucket) => {
  try {
    const response = await axios.get<DataApiPriceResponse>(
      `${BASE_URL}/prices?oracle=${oracle}&bucket=${bucket}`
    );
    return response.data.map(priceRow => ({
      ts: priceRow.t,
      value: priceRow.v.toString(),
    }));
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};
