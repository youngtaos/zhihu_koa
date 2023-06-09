const Router = require('koa-router')
const router = new Router({ prefix: '/questions/:questionId/answer' })
const jwt = require('koa-jwt')
const { getNewAnswerList, getHotAnswerList, addAnswer, getAnswerById, deleteAnswerById,
    editAnswerById, checkAnswerExist, checkAnswerer, listUpper } = require('../controllers/answer')
const secret = "yang123ghiogho"

const auth = jwt({ secret })

router.get('/', getNewAnswerList)
router.get('/hot', getHotAnswerList)

router.post('/', auth, addAnswer)

router.get('/:id', checkAnswerExist, getAnswerById)
router.patch('/:id', auth, checkAnswerExist, checkAnswerer, editAnswerById)
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, deleteAnswerById)
router.get('/:id/upper', listUpper)


module.exports = router