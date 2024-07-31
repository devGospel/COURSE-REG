const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    level: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    credit: {
        type: Number,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    nature: {
        type: String,
        required: true
    },

})

const course = mongoose.model('course', courseSchema)
module.exports = course;