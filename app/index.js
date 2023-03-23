const Koa = require('koa')
const { koaBody } = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
require('dotenv').config();
const mongoose = require('mongoose')
const URI = process.env.MONGO_URI
const path = require('path')
const app = new Koa()
const routing = require('./routes')
app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('数据库连接成功'))
    .catch(err => console.log(err, '数据连接失败'))

// middleware的顺序很重要，这个koa-bodyparser必须在router之前被注册到app对象上
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, 'public/upload/'),
        keepExtensions: true
    }
}))
app.use(parameter(app))
routing(app)


app.listen(7000, () => {
    console.log("服务启动成功")
})