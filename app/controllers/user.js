const db = [{ "name": 'yts' }]

class userCtroller {
    getUserList(ctx) {
        ctx.body = db
    }
    addUser(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            age: { type: 'number', required: false }
        })
        db.push(ctx.request.body)
        ctx.body = ctx.request.body
    }
    getUserById(ctx) {
        if (ctx.params.id * 1 >= db.length) {
            ctx.throw(412)
        }
        ctx.body = db[ctx.params.id * 1]
    }
    editUserById(ctx) {
        if (ctx.params.id * 1 >= db.length) {
            ctx.throw(412)
        }
        ctx.verifyParams({
            name: { type: 'string', required: true },
            age: { type: 'number', required: false }
        })
        db[ctx.params.id * 1] = ctx.request.body
        ctx.body = ctx.request.body
    }
    deleteUserById(ctx) {
        if (ctx.params.id * 1 >= db.length) {
            ctx.throw(412)
        }
        db.splice(ctx.params.id * 1, 1)
        ctx.status = 204
    }
}

module.exports = new userCtroller()