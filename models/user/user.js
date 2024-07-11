const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,

    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
    },
    dob: {
        type: Date,
    },
    password: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart'
    },
    wishlist: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    wallet: {
        balance: {
            type: Number,
            default:0,
        },
        transactions: [
            {
                id: {
                    type: Number
                },
                date: {
                    type: Date,
                },
                amount: {
                    type: Number,
                },
                orderType: {
                    type: String
                }
            }
        ]
    }
})

const User = new mongoose.model('user', userSchema);

module.exports = User