const Comment = require('../models/comment');
const User = require('../models/user')

class CommentController {
    async checkCommentExist(ctx, next) {
        const comment = await Comment.findById(ctx.params.id)
        if (!comment) {
            ctx.throw(404, "评论不存在")
        }
        if (ctx.params.questionId && (comment.questionId !== ctx.params.questionId)) {
            ctx.throw(404, "该问题下没有此评论")
        }
        if (ctx.params.answerId && (comment.answerId !== ctx.params.answerId)) {
            ctx.throw(404, "该答案下没有此评论")
        }
        await next()
    }

    async checkCommentator(ctx, next) {
        const comment = await Comment.findById(ctx.params.id)
        if (comment.commentator.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有相关权限')
        }
        await next()
    }

    async getCommentList(ctx) {
        const { per_Page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(per_Page * 1, 1)
        const q = new RegExp(ctx.query.q)
        const { questionId, answerId } = ctx.params
        ctx.body = await Comment.find({ content: q, questionId, answerId })
            .limit(perPage).skip(page * perPage)
            .populate('commentator')
    }
    async getCommentById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(";").filter(f => f).map(f => '+' + f).join('')
        const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator')
        if (!comment) {
            ctx.throw('该评论不存在')
        }
        ctx.body = comment
    }
    async addComment(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
        })
        const { questionId, answerId } = ctx.params
        const comment = await new Comment({ ...ctx.request.body, commentator: ctx.state.user._id, questionId, answerId }).save()
        ctx.body = comment
    }

    async editCommentById(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
        })
        const comment = await Comment.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!comment) { ctx.throw('该评论不存在') }
        ctx.body = comment
    }

    async deleteCommentById(ctx) {
        await Comment.findByIdAndRemove(ctx.params.id)
        ctx.status = 204
    }

}

module.exports = new CommentController()