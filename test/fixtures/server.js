import Koa from 'koa'
import Body from 'koa-body'
import debug from 'debug'
import * as route from 'route'

const log = debug('{debug}')

const server = new Koa()
server.use(Body({ multipart: true }))
route.bind(server, `${__dirname}/resources/*.js`, { prefix: '/v1' })

const porta = 9394
server.listen(porta, () => {
  log(`Server started at port: ${porta}`)
})

const serverWithoutBody = new Koa()
route.bind(serverWithoutBody, `${__dirname}/resources/*.js`, { prefix: '/v1' })

const portb = 9395
serverWithoutBody.listen(portb, () => {
  log(`Server started at port: ${portb}`)
})

export {
  server,
  serverWithoutBody
}
