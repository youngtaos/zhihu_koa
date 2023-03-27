const mongoose = require('mongoose')

const { Schema, model } = mongoose

const questionSchema = new Schema({
    "__v": { type: Number, select: false },
    name: { type: String, required: true },
    description: { type: String },
    questioner: {
        type: Schema.Types.ObjectId, ref: 'User', required: true,
        select: true
    },
    topics: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
        select: false
    }
})

module.exports = model('Question', questionSchema)