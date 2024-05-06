import axios from 'axios';
import { DatabarnTimelineResponse } from './types';

const BASE_URL = 'https://databarn.beefy.finance/api/v1/beefy'

export const getDataBarnTimeline = async (address: string): Promise<DatabarnTimelineResponse> => {
  try {
    const response = await axios.get(BASE_URL + '/timeline?address=' + address);
    return response.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        return [];
      }
    }
    throw err;
  }
}