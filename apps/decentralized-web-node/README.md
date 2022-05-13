# SSI Decentralized Web Node

## Description

This [ssi-dwn](./apps/decentralized-web-node) is a NestJs implementation of the [DIF Identity foundation](https://identity.foundation/) [Decentralized Web Node](https://identity.foundation/decentralized-web-node/spec/).
[Nest](https://github.com/nestjs/nest) is a Typescript framework for server-side applications.

## Installation

Install using the [rush commands](../../README.md#installation) described in the root README.

## Running the app

Alternatively to `npm`, `pnpm` can be used for the commands below.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
### Swagger/OpenAPI

After starting the `ssi-dwn` app, 
the Swagger/OpenAPI test page can be see at `{appURL}/api` (`http://localhost:3000/api` if running locally)

## Test

Alternatively to `npm`, `pnpm` can be used for the commands below.

```bash
# e2e tests
$ npm run test

# test coverage
$ npm run test:cov
```

### Decentralized web node Module
An implementation of the [Decentralized Web Node](https://identity.foundation/decentralized-web-node/spec/). Currently it's acting as a Verifiable Credential Storage.

### Presentation exchange Module
Module is responsible for matching Verifiable Credentials to given presentation definition. Credentials are taken from  
decentralized web node module.
## Database
Currently, the app uses an **PostgreSQL** database for app execution and tests.

## Auth
All endpoints are requiring authentication. Request must contain `token` cookies which contain identity token that can be obtain from [SSI Hub](https://github.com/energywebfoundation/ssi-hub).

## License

This project is licensed under the GNU General Public License v3.0 or later - see the [LICENSE](LICENSE) file for details
NestJs is [MIT licensed](LICENSE).
