const Router = require('koa-router')
const router = new Router({ prefix: '/topics' })
const jwt = require('koa-jwt')
const { getTopicList, addTopic, getTopicById,
    editTopicById } = require('../controllers/topics')
const secret = "yang123ghiogho"

const auth = jwt({ secret })

router.get('/', getTopicList)

router.post('/', auth, addTopic)

router.get('/:id', getTopicById)
router.patch('/:id', auth, editTopicById)
// router.delete('/:id', auth, deleteUserById)


module.exports = router