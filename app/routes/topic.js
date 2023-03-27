const Router = require('koa-router')
const router = new Router({ prefix: '/topics' })
const jwt = require('koa-jwt')
const { getTopicList, addTopic, getTopicById,
    editTopicById, checkTopicExist, listTopicFollower } = require('../controllers/topics')
const secret = "yang123ghiogho"

const auth = jwt({ secret })

router.get('/', getTopicList)

router.post('/', auth, addTopic)

router.get('/:id', checkTopicExist, getTopicById)
router.patch('/:id', auth, checkTopicExist, editTopicById)
router.get('/:id/follower', listTopicFollower)
// router.delete('/:id', auth, deleteUserById)


module.exports = router