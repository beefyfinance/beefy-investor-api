import axios from 'axios';
import { getAxiosInstance } from '../../utils/http';
import { CLMAnalyticsUserTimelineResponse } from './types';

const http = getAxiosInstance(
  'https://clm-api.beefy.finance/api/v1/investor/',
  process.env['CLM_API_KEY'] || ''
);

export const getClmApiTimeline = async (address: string) => {
  try {
    const response = await http.get<CLMAnalyticsUserTimelineResponse>(`${address}/timeline`);
    return response.data;
  } catch (err: any) {
    console.log(err.message);
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        return [];
      }
    }
    throw err;
  }
};
