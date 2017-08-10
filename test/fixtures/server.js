import Koa from 'koa'
import Body from 'koa-body'
import glob from 'glob'
import debug from 'debug'
import * as route from 'route'

const log = debug('{debug}')

const server = new Koa()
const views = glob.sync(`${__dirname}/resources/*.js`)

server.use(Body({ multipart: true }))
route.bind(server, views, { prefix: '/v1' })

const porta = 9394
server.listen(porta, () => {
  log(`Server started at port: ${porta}`)
})

const serverWithoutBody = new Koa()
route.bind(serverWithoutBody, views, { prefix: '/v1' })

const portb = 9395
serverWithoutBody.listen(portb, () => {
  log(`Server started at port: ${portb}`)
})

export {
  server,
  serverWithoutBody
}
