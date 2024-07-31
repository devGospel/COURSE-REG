const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const secondCreditLimitSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
 
    totalCredit: {
        type: Number,
        required: true,
        default: 0}
})

const secondCreditLimit = mongoose.model('secondCreditLimit', secondCreditLimitSchema);
module.exports = secondCreditLimit;