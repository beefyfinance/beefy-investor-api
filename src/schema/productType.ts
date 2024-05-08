import { S } from 'fluent-json-schema';
import { allDatabarnProductTypes } from '../sources/databarn/types';

export const productTypeSchema = S.string()
  .enum(allDatabarnProductTypes)
  .examples(allDatabarnProductTypes)
  .description('Product type to query');
