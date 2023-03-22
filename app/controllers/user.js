const User = require('../models/user')
const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config();
const secret = "yang123ghiogho"

class userCtroller {
    async checkUser(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }
    async getUserList(ctx) {
        ctx.body = await User.find()
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
        const user = await User.findById(ctx.params.id)
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
        console.log(token)
        ctx.body = { token }
    }
}

module.exports = new userCtroller()