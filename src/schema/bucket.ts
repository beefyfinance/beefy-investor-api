import { S } from 'fluent-json-schema';
import { allTimeBuckets } from '../utils/time';

export const timeBucketSchema = S.string()
  .enum(allTimeBuckets)
  .examples(allTimeBuckets)
  .description('Time bucket for query');
