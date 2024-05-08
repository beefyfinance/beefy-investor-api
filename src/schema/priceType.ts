import { S } from 'fluent-json-schema';
import { allDatabarnPriceTypes } from '../sources/databarn/types';

export const priceTypeSchema = S.string()
  .enum(allDatabarnPriceTypes)
  .examples(allDatabarnPriceTypes)
  .description('Product type to query');
