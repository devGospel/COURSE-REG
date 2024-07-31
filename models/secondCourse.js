const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const secondCourseSchema = new Schema({
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

const secondCourse = mongoose.model('secondCourse', secondCourseSchema)
module.exports = secondCourse;