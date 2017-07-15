import Koa from 'koa';
import { bind } from 'route';

const server = new Koa();

bind(server, `${__dirname}/src/**/views.js`);

const port = 3000;
server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

