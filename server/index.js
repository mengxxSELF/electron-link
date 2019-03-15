const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');

const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const home = new Router();
const router = new Router();

const mysql_connection = require('./mysql');

home.get('/version', (ctx) => {
  ctx.body = { code: 200, canUpdate: false };
});

home.get('/dmg', (ctx) => {
  const { message } = ctx.query;
  console.log(message, 'err接口被调用');
  ctx.body = { code: 200 };
});

// 检查数据库配置
home.get('/config', async (ctx) => {
  const { group } = ctx.query;
  let sql = 'select * from server_group';
  if (group) {
    if (group == 'all') {
      sql = 'select * from server_config';
    } else {
      sql = `select * from server_config where groups = ${group}`;
    }
  }
  const result = await mysql_connection.query(sql);
  ctx.body = { code: 200, result };
});

// 增加配置
home.post('/config', async (ctx) => {
  const {
    address, title, groups, type,
  } = ctx.request.body;

  const sql = `insert into server_config (address, title, groups, type) values ('${address}', '${title}', ${groups}, ${type}) `;
  await mysql_connection.query(sql);
  ctx.body = { code: 200 };
});

// edit
home.post('/edit', async (ctx) => {
  const {
    address, title, id,
  } = ctx.request.body;

  const sql = `update server_config set address = '${address}' , title = '${title}' where id = ${id}`;
  await mysql_connection.query(sql);
  ctx.body = { code: 200 };
});

// 删除
home.get('/delete', async (ctx) => {
  const {
    id,
  } = ctx.query;

  const sql = `delete from server_config where id = ${id}`;
  await mysql_connection.query(sql);
  ctx.body = { code: 200 };
});

router.use('/electron', home.routes(), home.allowedMethods());

app.use(bodyParser());

app.use(cors());
app.use(async (_, next) => {
  console.log('ff');
  await next();
});

app.use(require('koa-static')(`${__dirname}/public`));

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());


app.listen(3890, () => {
  console.log('i am 3890');
});
