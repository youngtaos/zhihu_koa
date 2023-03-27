const Router = require('koa-router')
const router = new Router({ prefix: '/questions' })
const jwt = require('koa-jwt')
const { getQuestionList, addQuestion, getQuestionById, deleteQuestionById,
    editQuestionById, checkQuestionExist, checkQuestioner } = require('../controllers/question')
const secret = "yang123ghiogho"

const auth = jwt({ secret })

router.get('/', getQuestionList)

router.post('/', auth, addQuestion)

router.get('/:id', checkQuestionExist, getQuestionById)
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, editQuestionById)
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, deleteQuestionById)


module.exports = router