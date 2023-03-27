const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const jwt = require('koa-jwt')
const { getUserList, addUser, getUserById,
    editUserById, deleteUserById, login,
    checkUser, checkUserExist, listFollowing, follow, unFollow, listFollower } = require('../controllers/user')
const secret = "yang123ghiogho"

const auth = jwt({ secret })

router.get('/', getUserList)

router.post('/', addUser)

router.get('/:id', getUserById)
router.patch('/:id', auth, checkUser, editUserById)
router.delete('/:id', deleteUserById)
router.get('/:id/following', listFollowing)
router.get('/:id/follower', listFollower)

router.put('/following/:id', auth, checkUserExist, follow)
router.delete('/following/:id', auth, checkUserExist, unFollow)

router.post('/login', login)


module.exports = router