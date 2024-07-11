const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    transactions: [
        {
            id: {
                type: String,
                default:"ID"+Math.floor(10000 + Math.random() * 90000)
            },
            reference:{
                type: String,
            },
            date: {
                type: Date,
                default:Date.now(),
            },
            amount: {
                type: Number,
                required:true
            },
            orderType: {
                type: String,
                required:true
            }
        }
    ]
})

const walletModel = new mongoose.model('wallet',walletSchema)

module.exports = walletModel
