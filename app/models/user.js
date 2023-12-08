const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
    "__v": { type: Number, select: false },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    age: { type: Number, required: false },
    avatar_url: { type: String, select: true },
    gender: { type: String, enum: ['male', 'female'], default: 'male' },
    headline: { type: String },
    locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false },
    business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },
    employments: {
        type: [{
            company: { type: Schema.Types.ObjectId, ref: 'Topic' },
            job: { type: Schema.Types.ObjectId, ref: 'Topic' }
        }],
        select: false
    },
    educations: {
        type: [{
            school: { type: Schema.Types.ObjectId, ref: 'Topic' },
            major: { type: Schema.Types.ObjectId, ref: 'Topic' },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
            entrance_year: { type: Number },
            graduation_year: { type: Number }
        }],
        select: false
    },
    following: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        select: false
    },
    followingTopic: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
        select: false
    },
    upAnswer: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
        select: false
    },
    downAnswer: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
        select: false
    },
    collectedQuestion: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
        // select: false
    },
    followerNumber: {
        type: Number, required: false, default: 0,
    },
    followingNumber: {
        type: Number, required: false, default: 0,
    },
    questioningNumber: {
        type: Number, required: false, default: 0,
    },
    answeringNumber: {
        type: Number, required: false, default: 0,
    },
}, { timestamps: true })

module.exports = model('User', userSchema)