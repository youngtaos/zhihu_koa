const Koa = require('koa')
const Router = require('koa-router')
const BodyParer = require('koa-body-parser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')

const app = new Koa()
const router = new Router()
const usersRouter = new Router({ prefix: '/users' })
const bodyParer = new BodyParer()
const routing = require('./routes')

app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))

// middleware的顺序很重要，这个koa-bodyparser必须在router之前被注册到app对象上
app.use(bodyParer)
app.use(parameter(app))
routing(app)


app.listen(7000, () => {
    console.log("服务启动成功")
})