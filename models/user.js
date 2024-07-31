const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    email:{
        type: String,
        required: true
    },  
    password: {
        type: String,
        required: true,
        unique: true,
    },
    photo: {
        type: String,
        default: ''
    },
    level: {
        type: String,
        default: ''
    },

    schoolFeesPayment: {
        type: String,
        default:''
    }
})
    
const user = mongoose.model('user', UserSchema);

module.exports = user;

