import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createRequest, createWriteMessage } from '../../decentralized-web-node/utils';
import { TestUser } from '../../utils';

/**
 * @description add credential to storage
 */
export const addCredential = async (
  credentials: Record<string, unknown>[],
  holder: TestUser,
  app: INestApplication
): Promise<request.Response> => {
  const messages = await Promise.all([
    ...credentials.map(async (credential) => await createWriteMessage(credential))
  ]);
  const requestObj = await createRequest(messages, holder.did);

  return await request(app.getHttpServer()).post(`/v1/webnode`).send(requestObj).expect(201);
};
