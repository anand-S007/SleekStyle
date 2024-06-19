const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userEmail: {
        type: String,
        required: true,
    },
    orders: [{
        products: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                reqiured: true
            },
            category: {
                type: String,
            },
            image: {
                type: String,
                required: true,
            },
            size: {
                type: String,
                reqiured: true
            },
            quantity: {
                type: Number,
                required: true,
            },
            proPrice: {
                type: Number,
                required: true
            },
            subTotalPrice: {
                type: Number,
                required: true
            }
        }],
        address: {
            name: {
                type: String,
                required: true
            },
            mobile: {
                type: Number,
                required: true
            },
            pincode: {
                type: Number,
                required: true
            },
            locality: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            district: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true,
            }
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentStatus:{
            type: String,
            default:'pending'
        },
        couponDiscountAmount: {
            type: Number
        },
        totalPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: 'proccessing',
        },
        orderId: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }]
});

const orderModel = new mongoose.model('order', orderSchema)
module.exports = orderModel