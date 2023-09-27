/*
 * Copyright 2021 - 2023 Energy Web Foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src';
import { InputDesciptorToCredentialDto } from '../src/modules/converter/dtos';
import { resolve as resolvePath } from 'path';
import * as fs from 'fs';

const path = resolvePath(__dirname, 'payloads/car-ownership-cred-input-desc.json');

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let payload;

  beforeEach(async () => {
    payload = JSON.parse(fs.readFileSync(path).toString('utf8'));

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  describe('/converter/input-descriptor-to-credential (POST)', function () {
    describe('when called with a valid Car Ownership Credential ID', function () {
      let result: request.Response;
      beforeEach(async function () {
        result = await request(app.getHttpServer())
          .post('/converter/input-descriptor-to-credential')
          .send(payload);
      });

      it('should respond with 201 status code', async function () {
        expect(result.status).toBe(201);
      });

      it('should respond with application/json Content-Type header', async function () {
        expect(result.headers['content-type']).toMatch('application/json');
      });

      it('should respond with body containing data', async function () {
        const expectedResponse = {
          credential: JSON.parse(
            fs.readFileSync(resolvePath(__dirname, 'payloads/car-ownership-cred.json')).toString('utf8')
          )
        };

        expect(result.body).toBeDefined();
        expect(result.body).toEqual(expectedResponse);
      });
    });
  });
});
