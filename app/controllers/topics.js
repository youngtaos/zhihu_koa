const question = require('../models/question');
const Topic = require('../models/topics');
const user = require('../models/user');
require('dotenv').config();

class topicController {
    async checkTopicExist(ctx, next) {
        const topic = await Topic.findById(ctx.params.id)
        if (!topic) {
            ctx.throw(404, "词条不存在")
        }
        await next()
    }

    async getTopicList(ctx) {
        const { per_Page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(per_Page * 1, 1)
        ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) }).limit(perPage).skip(page * perPage)
    }
    async getTopicById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(";").filter(f => f).map(f => '+' + f).join('')
        const topic = await Topic.findById(ctx.params.id).select(selectFields)
        if (!topic) {
            ctx.throw('该词条不存在')
        }
        ctx.body = topic
    }
    async addTopic(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false },
        })
        const { name } = ctx.request.body
        const repeatedTopic = await Topic.findOne({ name })
        if (repeatedTopic) {
            ctx.throw("该词条已经存在")
        }
        const topic = await new Topic(ctx.request.body).save()
        ctx.body = topic
    }

    async editTopicById(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false },
        })
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!topic) { ctx.throw('该词条不存在') }
        ctx.body = topic
    }

    async listTopicFollower(ctx) {
        const followers = await user.find({ followingTopic: ctx.params.id })
        ctx.body = followers
    }

    async listQuestions(ctx) {
        const questions = await question.find({ topics: ctx.params.id })
        ctx.body = questions
    }
}

module.exports = new topicController()