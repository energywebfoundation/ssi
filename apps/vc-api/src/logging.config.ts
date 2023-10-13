import * as morgan from 'morgan';

declare module 'http' {
  interface IncomingMessage {
    body?: any;
  }

  interface ServerResponse {
    body?: any;
  }
}

morgan.token('req-body', (req) => JSON.stringify(req.body));
morgan.token('res-body', (req, res) => {
  if (res.body) {
    return JSON.stringify(res.body);
  }

  // // In case you're using express.json() or another body parser,
  // // you may want to capture the response this way:
  // const { rawBody } = res;
  // if (rawBody) {
  //   return JSON.stringify(JSON.parse(rawBody));
  // }

  return undefined;
});

export const morganFormat =
  ':method :url :status :response-time ms - req body: :req-body - res body: :res-body';
