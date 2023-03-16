const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const { getUserList, addUser, getUserById, editUserById, deleteUserById } = require('../controllers/user')

router.get('/', getUserList)

router.post('/', addUser)

router.get('/:id', getUserById)

router.put('/:id', editUserById)

router.delete('/:id', deleteUserById)

module.exports = router