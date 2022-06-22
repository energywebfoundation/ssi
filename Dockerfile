FROM node:16.10.0-alpine as base

WORKDIR /app

FROM base as builder

RUN apk add g++ make py3-pip

COPY common common
COPY rush.json .
COPY apps/vc-api/package.json apps/vc-api/package.json
COPY libraries/did/package.json libraries/did/package.json
COPY libraries/webkms/package.json libraries/webkms/package.json

RUN node common/scripts/install-run-rush.js install

COPY . .

RUN node common/scripts/install-run-rush.js build
RUN node common/scripts/install-run-rush.js deploy -s ssi-vc-api
RUN cp -R ./apps/vc-api/dist ./common/deploy/apps/vc-api

FROM base as final
ENV NODE_ENV=production
EXPOSE 3000

COPY --from=builder /app/common/deploy /app

CMD ["node", "apps/vc-api/dist/src/main.js"]
