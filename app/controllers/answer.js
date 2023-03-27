const Answer = require('../models/answer');

class AnswerController {
    async checkAnswerExist(ctx, next) {
        const answer = await Answer.findById(ctx.params.id)
        if (!answer || answer.questionId !== ctx.params.questionId) {
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

    async getAnswerList(ctx) {
        const { per_Page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(per_Page * 1, 1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Answer.find({ content: q, questionId: ctx.params.questionId })
            .limit(perPage).skip(page * perPage)
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
        ctx.status = 204
    }
}

module.exports = new AnswerController()