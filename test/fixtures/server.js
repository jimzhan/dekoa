import Koa from 'koa';
import debug from 'debug';
import * as route from 'route';

const log = debug('{debug}');

const server = new Koa();
route.bind(server, `${__dirname}/resources/*.js`, { prefix: '/v1' });

const port = process.env.PORT || 9394;
server.listen(port, () => {
  log(`Server started at port: ${port}`);
});
export default server;