const User = require('../models/user')
const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config();
const secret = "yang123ghiogho"

class userController {
    async checkUser(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }
    async checkUserExist(ctx, next) {
        const user = await User.findById(ctx.params.id)
        if (!user) {
            ctx.throw(404, "用户不存在")
        }
        await next()
    }

    async getUserList(ctx) {
        const { per_Page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(per_Page * 1, 1)
        ctx.body = await User.find({ name: new RegExp(ctx.query.q) }).limit(perPage).skip(page * perPage)
    }
    async addUser(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            age: { type: 'number', required: false },
            password: { type: 'string', required: true },
        })
        const { name } = ctx.request.body
        const repeatedUser = await User.findOne({ name })
        if (repeatedUser) {
            ctx.throw("用户已经存在")
        }
        const user = await new User(ctx.request.body).save()
        ctx.body = user
    }
    async getUserById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(";").filter(f => f).map(f => '+' + f).join('')
        const populateStr = fields.split(";").filter(f => f).map(f => {
            if (f === 'employments') {
                return 'employments.company employments.job'
            }
            if (f === 'educations') {
                return 'educations.school educations.major'
            }
            return f
        }).join(' ')
        const user = await User.findById(ctx.params.id).select(selectFields)
            .populate(populateStr)
        if (!user) {
            ctx.throw('用户不存在')
        }
        ctx.body = user
    }
    async editUserById(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            age: { type: 'number', required: false },
            password: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            gender: { type: 'string', required: false },
            headline: { type: 'string', required: false },
            locations: { type: 'array', itemType: "string", required: false },
            business: { type: 'string', required: false },
            employments: { type: 'array', itemType: "Object", required: false },
            educations: { type: 'array', itemType: "Object", required: false },
        })
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) { ctx.throw('用户不存在') }
        ctx.body = user
    }
    async deleteUserById(ctx) {
        const user = await User.findByIdAndDelete(ctx.params.id)
        if (!user) { ctx.throw('用户不存在') }
        ctx.body = user
    }

    async login(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true },
        })
        const user = await User.findOne(ctx.request.body)
        if (!user) {
            ctx.throw("登录失败")
        }
        const { _id, name } = user
        const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
        ctx.body = { token }
    }

    async listFollowing(ctx) {
        const user = await User.findById(ctx.params.id).select('+following').populate('following')
        if (!user) {
            ctx.throw(404, '此用户不存在')
        }
        ctx.body = user.following
    }

    async follow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
            me.following.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }

    async unFollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
        if (index > -1) {
            me.following.splice(index, 1)
            me.save()
        }
        ctx.status = 204
    }

    async listFollower(ctx) {
        const followers = await User.find({ following: ctx.params.id })
        ctx.body = followers
    }
}

module.exports = new userController()