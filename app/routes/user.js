const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const jwt = require('koa-jwt')
const { getUserList, addUser, getUserById,
    editUserById, deleteUserById, login,
    checkUser, listFollowing, follow, unFollow } = require('../controllers/user')
const secret = "yang123ghiogho"

const auth = jwt({ secret })

router.get('/', getUserList)

router.post('/', addUser)

router.get('/:id', getUserById)

router.patch('/:id', auth, checkUser, editUserById)

router.delete('/:id', auth, checkUser, deleteUserById)

router.get('/:id/following', listFollowing)

router.put('/following/:id', auth, follow)

router.delete('/following/:id', auth, unFollow)

router.post('/login', login)

module.exports = router