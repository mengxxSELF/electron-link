const Koa = require('koa')
const app = new Koa(); 
const Router = require('koa-router')

let home = new Router()
let router = new Router()
 
const mysql_connection = require('./mysql')

home.get('/version', (ctx) => {
  const { message } = ctx.query
  console.log(message, 'err接口被调用')
  ctx.body = { code : 200, canUpdate: false }
})

home.get('/dmg', (ctx) => {
  const { message } = ctx.query
  console.log(message, 'err接口被调用')
  ctx.body = { code : 200 }
})

// 检查数据库配置
home.get('/config', async (ctx) => {
  const { group } = ctx.query
  const sql = `select * from server_group`
  const result = await mysql_connection.query(sql)
  console.log('result', result)

  ctx.body = { code: 200, result }
})

router.use('/electron', home.routes(), home.allowedMethods())

app.use(async (_, next) => {
  console.log('ff')
  await next()
})

app.use(require('koa-static')(__dirname + '/public'));

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())


app.listen(3890, () => {
  console.log('i am 3890')
})