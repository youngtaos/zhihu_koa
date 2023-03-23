class HomeCtroller {
    index(ctx) {
        ctx.body = '这是主页'
    }
    upload(ctx) {
        const file = ctx.request.files.file
        ctx.body = { path: file.filepath }
    }
}

module.exports = new HomeCtroller()