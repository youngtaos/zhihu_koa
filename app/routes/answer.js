const Router = require('koa-router')
const router = new Router({ prefix: '/questions/:questionId/answer' })
const jwt = require('koa-jwt')
const { getAnswerList, addAnswer, getAnswerById, deleteAnswerById,
    editAnswerById, checkAnswerExist, checkAnswerer } = require('../controllers/answer')
const secret = "yang123ghiogho"

const auth = jwt({ secret })

router.get('/', getAnswerList)

router.post('/', auth, addAnswer)

router.get('/:id', checkAnswerExist, getAnswerById)
router.patch('/:id', auth, checkAnswerExist, checkAnswerer, editAnswerById)
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, deleteAnswerById)


module.exports = router