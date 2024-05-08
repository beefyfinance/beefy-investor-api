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

// const timelineSuccessResponse = S.object()
//   .examples([
//     {
//       result: {
//         databarnTimeline: [
//           {
//             "datetime": "2023-08-20T20:57:11.000Z",
//             "product_key": "beefy:boost:base:0x819d32901df52ac4bd513cf28cbf0ef3d029a6ff",
//             "display_name": "moo_alienbase-dai-usdbc-alienbase",
//             "chain": "base",
//             "is_eol": false,
//             "is_dashboard_eol": false,
//             "transaction_hash": "0x9ad3108f84bcfda60ca26c1e4080ce99dcfbf6d53591ec48d912bda116e56147",
//             "share_to_underlying_price": 1.0009272211751885,
//             "underlying_to_usd_price": 1999982.9485286465,
//             "share_balance": 0.019283165995726777,
//             "underlying_balance": 0.019301045755562688,
//             "usd_balance": 38601.76239989659,
//             "share_diff": 0.019283165995726777,
//             "underlying_diff": 0.019301045755562688,
//             "usd_diff": 38601.76239989659
//           }
//         ],
//         clmTimeline: [
//           {
//             "datetime": "2024-04-08T13:52:36.000Z",
//             "product_key": "beefy:vault:arbitrum:0x2a2e016f9c30c7da5a41b21c19e9619ff78ab673",
//             "display_name": "Cow Uniswap Arbitrum PENDLE-ETH",
//             "chain": "arbitrum",
//             "is_eol": false,
//             "is_dashboard_eol": false,
//             "transaction_hash": "0x6ceda10c8eeb53ce5f41c4dc23380862a4886ff1b6e96ed2b9926349492fd80c",
//             "token0_to_usd": "6.565829469503295456",
//             "token1_to_usd": "3621.6",
//             "share_balance": "0.008044299685694356",
//             "underlying0_balance": "2.224074617741016575",
//             "underlying1_balance": "0.003999999999999501",
//             "usd_balance": "29.0892946675364363086664393020181832",
//             "share_diff": "0.008044299685694356",
//             "underlying_diff0": "2.224074617741016575",
//             "underlying_diff1": "0.003999999999999501",
//             "usd_diff": "29.0892946675364363086664393020181832"
//           }
//         ]
//       }
//     }
//   ])
//   .prop(
//     'result',
//     S.object()
//       .prop('clmTimeline', S.array().items(
//         S.object()
//           .prop('product_key', S.string())
//           .prop('display_name', S.string())
//           .prop('chain', S.string())
//           .prop('is_eol', S.boolean())
//           .prop('is_dashboard_eol', S.boolean())
//           .prop('transaction_hash', S.string())
//           .prop('share_balance', S.number())
//           .prop('share_diff', S.number())
//           .prop('share_to_underlying_price', S.number())
//           .prop('underlying_balance', S.number())
//           .prop('datetime', S.string())
//           .prop('underlying_diff', S.number())
//           .prop('underlying_to_usd_price', S.number())
//           .prop('usd_balance', S.number())
//           .prop('usd_diff', S.number())
//       ))
//       .prop('databarnTimeline', S.array().items(
//         S.object()
//           .prop('product_key', S.string())
//           .prop('display_name', S.string())
//           .prop('chain', S.string())
//           .prop('is_eol', S.boolean())
//           .prop('is_dashboard_eol', S.boolean())
//           .prop('transaction_hash', S.string())
//           .prop('token0_to_usd', S.string())
//           .prop('token1_to_usd', S.string())
//           .prop('share_balance', S.string())
//           .prop('underlying0_balance', S.string())
//           .prop('underlying1_balance', S.string())
//           .prop('usd_balance', S.string())
//           .prop('share_diff', S.string())
//           .prop('underlying_diff0', S.string())
//           .prop('underlying_diff1', S.string())
//           .prop('usd_diff', S.string())
//       ))
//   );

type HistoricPriceRoute = { Querystring: HistoricPriceQueryString };

const timelineSchema: FastifySchema = {
  tags: ['v1'],
  querystring: priceQueryString,
  response: {
    200: {},
  },
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
