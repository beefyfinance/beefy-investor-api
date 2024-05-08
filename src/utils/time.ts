export const TIME_BUCKETS = {
  '1h_1d': { bin: '1 hour', range: { days: 1 }, maPeriod: { hours: 6 }, duration: 60 * 60 },
  '1h_1w': { bin: '1 hour', range: { days: 7 }, maPeriod: { hours: 48 }, duration: 60 * 60 },
  '1h_1M': { bin: '1 hour', range: { days: 30 }, maPeriod: { hours: 96 }, duration: 60 * 60 },
  '1d_1M': { bin: '1 day', range: { months: 1 }, maPeriod: { days: 10 }, duration: 60 * 60 * 24 },
  '1d_1Y': { bin: '1 day', range: { years: 1 }, maPeriod: { days: 30 }, duration: 60 * 60 * 24 },
  '1d_all': { bin: '1 day', range: { years: 10 }, maPeriod: { days: 30 }, duration: 60 * 60 * 24 },
};

export type TimeBucket = keyof typeof TIME_BUCKETS;

export const allTimeBuckets = Object.keys(TIME_BUCKETS);
