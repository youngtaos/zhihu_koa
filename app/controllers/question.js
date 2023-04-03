const Question = require('../models/question');
const User = require('../models/user');
require('dotenv').config();

class QuestionController {
    async checkQuestionExist(ctx, next) {
        const question = await Question.findById(ctx.params.id)
        if (!question) {
            ctx.throw(404, "问题不存在")
        }
        await next()
    }

    async checkQuestioner(ctx, next) {
        const question = await Question.findById(ctx.params.id)
        if (question.questioner.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有相关权限')
        }
        await next()
    }

    async getQuestionList(ctx) {
        const { per_Page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(per_Page * 1, 1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Question.find({ $or: [{ name: q }, { description: q }] })
            .limit(perPage).skip(page * perPage).populate('questioner')
    }
    async getQuestionById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(";").filter(f => f).map(f => '+' + f).join('')
        const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics')
        if (!question) {
            ctx.throw('该问题不存在')
        }
        ctx.body = question
    }
    async addQuestion(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            description: { type: 'string', required: false },
        })
        const question = await new Question({ ...ctx.request.body, questioner: ctx.state.user._id }).save()
        await User.findByIdAndUpdate(ctx.state.user._id, { $inc: { questioningNumber: 1 } })
        ctx.body = question
    }

    async editQuestionById(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            description: { type: 'string', required: false },
        })
        const question = await Question.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!question) { ctx.throw('该问题不存在') }
        ctx.body = question
    }

    async deleteQuestionById(ctx) {
        await Question.findByIdAndRemove(ctx.params.id)
        await User.findByIdAndUpdate(ctx.state.user._id, { $inc: { questioningNumber: -1 } })
        ctx.status = 204
    }
}

module.exports = new QuestionController()