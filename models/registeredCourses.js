const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegisteredCourseSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
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
    
const registeredCourse = mongoose.model('registeredCourse', RegisteredCourseSchema);

module.exports = registeredCourse;

