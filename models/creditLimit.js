const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const creditLimitSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
 
    totalCredit: {
        type: Number,
        required: true,
        default: 0}
})

const creditLimit = mongoose.model('creditLimit', creditLimitSchema);
module.exports = creditLimit;