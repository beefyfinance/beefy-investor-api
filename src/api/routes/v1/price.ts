import { S } from 'fluent-json-schema';
import { addressSchema } from '../../../schema/address';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifySchema } from 'fastify';
import { getDataBarnPrice } from '../../../sources/databarn/barnApi';
import { DatabarnPriceType, DatabarnProductType } from '../../../sources/databarn/types';
import { productTypeSchema } from '../../../schema/productType';
import { timeBucketSchema } from '../../../schema/bucket';
import { priceTypeSchema } from '../../../schema/priceType';
import { getDataApiPrices } from '../../../sources/dataApi/dataApi';
import { TimeBucket } from '../../../utils/time';
import { isAxiosError } from 'axios';

interface DataApiPriceQueryString {
  oracle: string;
  bucket: string;
}

interface DatabarnPriceQueryString {
  address: string;
  productType: string;
  bucket: TimeBucket;
  priceType: string;
  chain: string;
}

export type HistoricPriceQueryString = DataApiPriceQueryString | DatabarnPriceQueryString;

const databarnQueryString = S.object()
  .prop('address', addressSchema.required().description('Product address to query'))
  .prop('productType', productTypeSchema.required().description('Product type to query'))
  .prop('bucket', timeBucketSchema.required().description('Time bucket for query'))
  .prop('priceType', priceTypeSchema.required().description('Price type to query'))
  .prop('chain', S.string().required().description('Chain to query'));

const dataApiQueryString = S.object()
  .prop('oracle', S.string().required().description('Oracle to query'))
  .prop('bucket', timeBucketSchema.required().description('Time bucket for query'));

const priceQueryString = S.anyOf([databarnQueryString, dataApiQueryString]);

type HistoricPriceRoute = { Querystring: HistoricPriceQueryString };

const timelineSchema: FastifySchema = {
  tags: ['v1'],
  querystring: priceQueryString,
};

async function handlePriceHistory(reply: FastifyReply, queryParams: HistoricPriceQueryString) {
  try {
    const result =
      'productType' in queryParams
        ? await getDataBarnPrice(
            queryParams.chain,
            queryParams.productType as DatabarnProductType,
            queryParams.address,
            queryParams.bucket,
            queryParams.priceType as DatabarnPriceType
          )
        : await getDataApiPrices(queryParams.oracle, queryParams.bucket as TimeBucket);
    reply.status(200);
    return { result };
  } catch (err) {
    if (isAxiosError(err)) {
      reply.status(err.response?.status || 500);
      throw err;
    }
    throw err;
  }
}

export default async function (
  instance: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: (err?: Error) => void
) {
  instance.get<HistoricPriceRoute>(
    '/prices',
    { schema: timelineSchema },
    async (request, reply) => {
      return handlePriceHistory(reply, request.query);
    }
  );

  done();
}
