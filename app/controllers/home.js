const path = require('path')

class HomeCtroller {
    index(ctx) {
        ctx.body = '这是主页'
    }
    upload(ctx) {
        const file = ctx.request.files.file
        const basename = path.basename(file.filepath)
        ctx.body = { path: `${ctx.origin}/upload/${basename}` }
    }
}

module.exports = new HomeCtroller()