const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()
const usersRouter = new Router({ prefix: '/users' })

router.get('/', (ctx) => {
    ctx.body = '主页'
})

usersRouter.get('/', (ctx) => {
    ctx.body = '用户列表'
})

usersRouter.post('/', (ctx) => {
    ctx.body = '创建用户'
})

usersRouter.get('/:id', (ctx) => {
    ctx.body = ctx.params.id
})
app.use(router.routes())
app.use(usersRouter.routes())
app.listen(7001)