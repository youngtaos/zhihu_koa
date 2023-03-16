class HomeCtroller {
    index(ctx) {
        ctx.body = '这是主页'
    }
}

module.exports = new HomeCtroller()