import axios, { AxiosRequestConfig } from 'axios';

export function getHttpConfig(baseUrl: string, apiKey: string): AxiosRequestConfig {
  return {
    baseURL: baseUrl,
    headers: {
      'user-agent': 'beefy-investor-api',
      ...(apiKey?.length ? { authorization: `Bearer ${apiKey}` } : {}),
    },
  };
}

export function getAxiosInstance(baseUrl: string, apiKey: string) {
  return axios.create(getHttpConfig(baseUrl, apiKey));
}
