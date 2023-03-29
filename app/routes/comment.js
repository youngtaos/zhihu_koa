const Router = require('koa-router')
const router = new Router({ prefix: '/questions/:questionId/answer/:answerId/comment' })
const jwt = require('koa-jwt')
const { getCommentList, getCommentById,
    addComment, checkCommentExist, checkCommentator,
    editCommentById, deleteCommentById } = require('../controllers/comment')
const secret = "yang123ghiogho"

const auth = jwt({ secret })

router.get('/', getCommentList)

router.post('/', auth, addComment)

router.get('/:id', checkCommentExist, getCommentById)
router.patch('/:id', auth, checkCommentExist, checkCommentator, editCommentById)
router.delete('/:id', auth, checkCommentExist, checkCommentator, deleteCommentById)


module.exports = router