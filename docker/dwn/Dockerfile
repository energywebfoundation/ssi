FROM node:16.10.0-alpine as base

# Install the required packages
RUN apk add --no-cache curl \
    && curl -sL https://unpkg.com/@pnpm/self-installer | node
RUN npm install -g @microsoft/rush

COPY . .
RUN rush install && pnpm add -g pnpm && rush build

FROM node:16.10.0-alpine

COPY --from=base . .

EXPOSE 3000

WORKDIR /apps/decentralized-web-node

CMD [ "pnpm", "run", "start:prod" ]
