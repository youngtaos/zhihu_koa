const Answer = require('../models/answer');
const Question = require('../models/question');
const User = require('../models/user')

class AnswerController {
    async checkAnswerExist(ctx, next) {
        const answer = await Answer.findById(ctx.params.id)
        if (!answer || (ctx.params.questionId && (answer.questionId.toString() !== ctx.params.questionId))) {
            ctx.throw(404, "答案不存在")
        }
        await next()
    }

    async checkAnswerer(ctx, next) {
        const answer = await Answer.findById(ctx.params.id)
        if (answer.answerer.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有相关权限')
        }
        await next()
    }

    //返回最新数据
    async getNewAnswerList(ctx) {
        const { per_Page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(per_Page * 1, 1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Answer.find({ content: q, questionId: ctx.params.questionId })
            .limit(perPage).skip(page * perPage).sort({ createdAt: -1 })
    }

    //返回最热的答案
    async getHotAnswerList(ctx) {
        const { per_Page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(per_Page * 1, 1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Answer.find({ content: q, questionId: ctx.params.questionId })
            .limit(perPage).skip(page * perPage).sort({ voteCount: 1 })
    }

    async getAnswerById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(";").filter(f => f).map(f => '+' + f).join('')
        const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer')
        if (!answer) {
            ctx.throw('该问题不存在')
        }
        ctx.body = answer
    }
    async addAnswer(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
        })
        const answer = await new Answer({ ...ctx.request.body, answerer: ctx.state.user._id, questionId: ctx.params.questionId }).save()
        console.log(answer)
        await User.findByIdAndUpdate(ctx.state.user._id, { $inc: { answeringNumber: 1 } })
        await Question.findByIdAndUpdate(ctx.params.questionId, { $inc: { answeredNumber: 1 } })
        ctx.body = answer
    }

    async editAnswerById(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
        })
        const answer = await Answer.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!answer) { ctx.throw('该答案不存在') }
        ctx.body = answer
    }

    async deleteAnswerById(ctx) {
        await Answer.findByIdAndRemove(ctx.params.id)
        await Question.findByIdAndUpdate(ctx.params.questionId, { $inc: { answeredNumber: -1 } })
        await User.findByIdAndUpdate(ctx.state.user._id, { $inc: { answeringNumber: -1 } })
        ctx.status = 204
    }

    async listUpper(ctx) {
        const followers = await User.find({ upAnswer: ctx.params.id })
        ctx.body = followers
    }
}

module.exports = new AnswerController()