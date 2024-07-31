const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        rquired: true
    },
    level: {
        type: String,
        required: true
    }

})

const payment = mongoose.model('payment', paymentSchema);
module.exports = payment;