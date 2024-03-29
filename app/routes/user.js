const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const jwt = require('koa-jwt')
const { getUserList, addUser, getUserById,
    editUserById, deleteUserById, login,
    checkUser, checkUserExist, listFollowing,
    follow, unFollow, listFollower,
    followTopic, unFollowTopic, listFollowingTopic,
    listUserQuestions,
    listUpAnswer, upAnswer, unUpAnswer,
    listDownAnswer, downAnswer, unDownAnswer,
    collectedQuestion, listCollectedQuestion, unCollectedQuestion } = require('../controllers/user')
const { checkTopicExist } = require('../controllers/topics')
const { checkAnswerExist } = require('../controllers/answer')
const { checkQuestionExist } = require('../controllers/question')
const secret = "yang123ghiogho"

const auth = jwt({ secret })

router.get('/', getUserList)

router.post('/', addUser)
router.post('/login', login)

router.get('/:id', getUserById)
router.post('/:id', auth, checkUser, editUserById)
router.delete('/:id', deleteUserById)

router.get('/:id/following', listFollowing)
router.get('/:id/follower', listFollower)
router.get('/:id/questions', listUserQuestions)
router.put('/following/:id', auth, checkUserExist, follow)
router.delete('/following/:id', auth, checkUserExist, unFollow)

router.get('/:id/followingTopic', listFollowingTopic)
router.put('/followingTopic/:id', auth, checkTopicExist, followTopic)
router.delete('/followingTopic/:id', auth, checkTopicExist, unFollowTopic)

router.get('/:id/upAnswer', listUpAnswer)
router.put('/upAnswer/:id', auth, checkAnswerExist, upAnswer, unDownAnswer)
router.delete('/upAnswer/:id', auth, checkAnswerExist, unUpAnswer)

router.get('/:id/downAnswer', listDownAnswer)
router.put('/downAnswer/:id', auth, checkAnswerExist, downAnswer, unUpAnswer)
router.delete('/downAnswer/:id', auth, checkAnswerExist, unDownAnswer)

router.get('/:id/collectedQuestion', listCollectedQuestion)
router.put('/collectedQuestion/:id', auth, checkQuestionExist, collectedQuestion)
router.delete('/collectedQuestion/:id', auth, checkQuestionExist, unCollectedQuestion)





module.exports = router