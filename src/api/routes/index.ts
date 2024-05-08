import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';
import { API_ENV } from '../../config/env';
import timeline from './v1/timeline';
import price from './v1/price';

export default async function (
  instance: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: (err?: Error) => void
) {
  instance
    .register(FastifySwagger, {
      openapi: {
        info: {
          title: 'API',
          version: '1.0.0',
        },
        tags: [{ name: 'v1', description: 'API v1' }],
      },
    })
    .register(FastifySwaggerUI, {
      uiConfig: {
        deepLinking: false,
      },
      staticCSP: API_ENV === 'production',
    })
    .get('/openapi.json', { config: { rateLimit: false } }, (_req, reply) => {
      reply.send(instance.swagger());
    })
    .register(timeline, { prefix: '/v1' })
    .register(price, { prefix: '/v1' });
  done();
}
