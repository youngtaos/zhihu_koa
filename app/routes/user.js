const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const jwt = require('koa-jwt')
const { getUserList, addUser, getUserById,
    editUserById, deleteUserById, login,
    checkUser, checkUserExist, listFollowing,
    follow, unFollow, listFollower,
    followTopic, unFollowTopic, listFollowingTopic,
    listUserQuestions } = require('../controllers/user')
const { checkTopicExist } = require('../controllers/topics')
const secret = "yang123ghiogho"

const auth = jwt({ secret })

router.get('/', getUserList)

router.post('/', addUser)

router.get('/:id', getUserById)
router.patch('/:id', auth, checkUser, editUserById)
router.delete('/:id', deleteUserById)

router.get('/:id/following', listFollowing)
router.get('/:id/follower', listFollower)
router.get('/:id/questions', listUserQuestions)
router.put('/following/:id', auth, checkUserExist, follow)
router.delete('/following/:id', auth, checkUserExist, unFollow)

router.get('/:id/followingTopic', listFollowingTopic)
router.put('/followingTopic/:id', auth, checkTopicExist, followTopic)
router.delete('/followingTopic/:id', auth, checkTopicExist, unFollowTopic)

router.post('/login', login)


module.exports = router