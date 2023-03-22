const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const jwt = require('koa-jwt')
const { getUserList, addUser, getUserById, editUserById, deleteUserById, login, checkUser } = require('../controllers/user')
const secret = "yang123ghiogho"
// const auth = async (ctx, next) => {
//     const { authorization = '' } = ctx.request.header;
//     const token = authorization.replace('Bearer ', '')
//     console.log(token)
//     try {
//         const user = jsonwebtoken.verify(token, secret)
//         ctx.state.user = user
//     } catch (err) {
//         ctx.throw(401, err.message)
//     }
//     await next()
// }
const auth = jwt({ secret })

router.get('/', getUserList)

router.post('/', addUser)

router.get('/:id', getUserById)

router.patch('/:id', auth, checkUser, editUserById)

router.delete('/:id', auth, checkUser, deleteUserById)

router.post('/login', login)

module.exports = router