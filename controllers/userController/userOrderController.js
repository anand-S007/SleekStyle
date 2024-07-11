const userAddress = require('../../models/user/userAddressModel')
const cartModel = require('../../models/user/cartSchema')
const productModel = require('../../models/admin/productSchema')
const orderModel = require('../../models/user/orderModel')
const couponModel = require('../../models/admin/couponModel')
const walletModel = require('../../models/user/walletModel')
const { v4: uuidv4 } = require('uuid')
const { default: mongoose } = require('mongoose')
const Razorpay = require('razorpay')


// apply coupon
const applyCoupon = async (req, res) => {
    try {
        const user = req.session.user
        const couponCode = req.body.couponCode
        const couponData = await couponModel.findOne({ code: couponCode })
        const cartData = await cartModel.findOne({ userId: user._id })

        if (couponData) {

            const isPresent = couponData.redeemedUser.includes(user._id)
            // check user redeemed or not
            if (!isPresent) {

                // check totalprice less than minimum purchase amount
                if (cartData.totalPrice > couponData.minPurchaseAmount) {

                    const discountPercent = couponData.discountPercentage
                    const maxDiscount = couponData.maxDiscountAmount
                    const discountAmount = (discountPercent * cartData.totalPrice) / 100
                    let finalDiscount = discountAmount

                    if (discountAmount > maxDiscount) {
                        finalDiscount = maxDiscount
                    }

                    if (finalDiscount >= cartData.totalPrice) {
                        return res.json({ success: false, message: 'Discount exceeds the total price!' })
                    }

                    res.json({ success: true, message: 'Coupon applied successfully', discount: finalDiscount, totalPrice: cartData.totalPrice })
                } else {
                    res.json({
                        success: false,
                        message: `Price is less than minimum purchase amount, Purchase products for minimum Rs ${couponData.minPurchaseAmount}`
                    })
                }
            } else {
                res.json({ success: false, message: 'Coupon is already redeemed' })
            }
        } else {
            res.json({ success: false, message: 'Invalid coupon code' })
        }
    } catch (error) {
        console.log(error);
    }
}

const viewEditAddress = async (req, res) => {
    const addressId = req.query.addressId
    const user = req.session.user
    const userAddresses = await userAddress.findOne({ userId: user._id })
    if (!userAddresses) {
        res.redirect('/checkout')
    }
    const findAddress = userAddresses.addresses.find((data) => data._id == addressId)
    if (findAddress) {
        res.render('user/page_checkoutEditAddress', { findAddress, user })
    } else {
        res.render('user/404_page')
    }
}

// edit address
const editAddress = async (req, res) => {
    const { name, phone, pincode, locality, address, district, state, addressId } = req.body
    const newAddress = { name, mobile: phone, pincode, locality, address, district, state }
    const userAddresses = await userAddress.findOne({ userId: req.session.user._id })
    const addressIndex = userAddresses.addresses.findIndex((data) => data._id == addressId)
    userAddresses.addresses[addressIndex] = newAddress
    const updatedAddress = await userAddresses.save()
    if (updatedAddress) {
        res.status(200).json({ success: true, message: "Address updated successfully" });
    }
}

const viewAddAddress = async (req, res) => {
    try {
        const userId = req.query.userId
        const user = req.session.user
        if (userId == user._id) {
            res.render('user/page_checkoutAddAddress', { user, userId })
        } else {
            res.render('user/404_page')
        }
    } catch (error) {

    }
}

const addAddress = async (req, res) => {
    try {
        const { name, phone, pincode, locality, address, district, state } = req.body
        console.log(req.body);
        const checkUserExist = await userAddress.findOne({ userId: req.session.user._id })
        if (checkUserExist) {
            const checkAddressExist = checkUserExist.addresses.find((item) => item.address == address)
            if (checkAddressExist) {
                res.json({ addressExistError: 'Address already exists' })
            } else {
                checkUserExist.addresses.push({ name, mobile: phone, pincode, locality, address, district, state })
                const saveAddress = await checkUserExist.save()
                if (saveAddress) {
                    res.json({ success: true })
                    console.log('entry');
                } else {
                    res.status(404).json({ saveFailedError: 'user saving failed' })
                    console.log('user adress not saved');
                }
            }
        } else {
            const data = {
                userId: req.session.user._id,
                addresses: [{
                    name,
                    mobile: phone,
                    pincode,
                    locality,
                    address,
                    district,
                    state
                }]
            }
            const userAddressDoc = new userAddress(data)
            const saveUserAddress = await userAddressDoc.save()
            if (saveUserAddress) {
                res.json({ success: true })
            } else {
                res.status(404).json({ saveFailedError: 'user saving failed' })
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const placeOrder = async (req, res) => {
    try {
        const user = req.session.user
        const { cartId, selectedAddressId, paymentMethod, couponCode, couponDiscount, totalPrice } = req.body

        const uuid = uuidv4()
        const truncateUuid = uuid.substring(0, 6)

        if (!cartId) {
            return res.json({ success: false, message: 'Cart is empty' })
        }
        // Data in the cart
        const cartData = await cartModel.findOne({ _id: cartId })
            .populate({
                path: 'items.productId',
                populate: {
                    path: 'category',
                    model: 'category'
                }
            })
            .exec();

        for (const item of cartData.items){
            let sizeQtyPath = `size.${item.size}.quantity`
            const product = await productModel.findOne({ _id: item.productId._id })
    
            const sizeQty = product.get(sizeQtyPath)
    
            if (item.quantity > sizeQty) {
                console.log('Product is out of stock');
                return res.json({
                    outOfStock: true,
                    message: `${item.productId.title}`,
                })
            }
        }


        // Delivery address
        const userAddressData = await userAddress.findOne(
            {
                userId: req.session.user._id,
                addresses: { $elemMatch: { _id: selectedAddressId } }
            },
            { 'addresses.$': 1 }
        )
        const deliveryAddress = userAddressData.addresses[0]

        // ordered products
        const orderItems = cartData.items.map((item) => {
            return {
                productId: item.productId._id,
                name: item.productId.title,
                description: item.productId.description,
                category: item.productId.category.name,
                image: item.productId.image[0],
                size: item.size,
                quantity: item.quantity,
                proPrice: item.proPrice,
                subTotalPrice: item.subTotalPrice
            }
        })

        // Data of new order
        let newOrder = {
            products: orderItems,
            address: {
                name: deliveryAddress.name,
                mobile: deliveryAddress.mobile,
                pincode: deliveryAddress.pincode,
                locality: deliveryAddress.locality,
                address: deliveryAddress.address,
                district: deliveryAddress.district,
                state: deliveryAddress.state
            },
            paymentMethod,
            couponDiscountAmount: couponDiscount ? couponDiscount : null,
            totalPrice,
            status: 'processing',
            orderId: `ORD${truncateUuid}`
        }

        if (paymentMethod == 'cod') {
            await finalizeOrder(newOrder, user, couponDiscount, couponCode)

            // updating stock in productModel
            for (const item of cartData.items) {
                const sizeField = `size.${item.size}.quantity`
                await productModel.updateOne(
                    { _id: item.productId._id },
                    { $inc: { [sizeField]: -item.quantity } }
                )
            }
            // Delete cart data
            await cartModel.deleteOne({ userId: user._id })

            delete req.session.cartData
            return res.json({ success: true, message: 'Order is successfully placed' })
        }
        // Razorpay payment
        else if (paymentMethod == 'razorpay') {
            const options = {
                amount: totalPrice * 100,
                currency: 'INR',
                receipt: newOrder.orderId,
                payment_capture: 1,
            }
            const instance = new Razorpay({
                key_id: process.env.keyId,
                key_secret: process.env.secret_key
            })

            instance.orders.create(options, async (err, order) => {
                if (order && order.status === 'created') {

                    return res.json({
                        status: 'razorpay',
                        order,
                        address: newOrder.address,
                        email: user.email,
                        cartData,
                        newOrder, user, couponDiscount, couponCode
                    });
                } else {
                    console.log(err);
                }
            })
        }
        else if(paymentMethod == 'wallet'){

            const wallet = await walletModel.findOne({userId:user._id, balance:{$gte:totalPrice}})
            console.log(wallet);
            if(!wallet){
                return res.json({wallet:false,message:'Insufficent balance amount in wallet'})
            }
            await finalizeOrder(newOrder, user, couponDiscount, couponCode)
            wallet.balance -= totalPrice
            const transaction ={
                reference: newOrder.orderId,
                amount:totalPrice,
                orderType:'credit'
            }
            wallet.transactions.push(transaction)
            const orderStatusUpdate = await orderModel.updateOne(
                { userId: user._id, 'orders.orderId': newOrder.orderId }, 
                { $set: { 'orders.$.paymentStatus': 'successfull' } } 
            );

             // updating stock in productModel
             for (const item of cartData.items) {
                const sizeField = `size.${item.size}.quantity`
                await productModel.updateOne(
                    { _id: item.productId._id },
                    { $inc: { [sizeField]: -item.quantity } }
                )
            }
            // Delete cart data
            await cartModel.deleteOne({ userId: user._id })

            delete req.session.cartData
            await wallet.save()
            return res.json({success:true,message:'Order is successfully placed'})
        }

    } catch (error) {
        console.log(error);
    }
}
// function to finalize order
async function finalizeOrder(newOrder, user, couponDiscount, couponCode) {
    try {
        const userOrder = await orderModel.findOne({ userId: user._id })
        if (userOrder) {
            // If user already placed order push newOrder to orders
            userOrder.orders.push(newOrder)
            await userOrder.save()
        } else {
            // Creating new order
            const newOrderDocument = new orderModel({
                userId: user._id,
                userEmail: user.email,
                orders: [newOrder],
            })
            await newOrderDocument.save();
        }

        // coupon
        if (couponDiscount && couponCode) {
            const coupon = await couponModel.findOne({ code: couponCode })
            if (coupon) {
                coupon.redeemedUser.push(user._id)
                coupon.usedCount += 1
                await coupon.save()
            }
        }

    } catch (error) {
        console.log(error);
    }
}
// payment verification
const verifyPayment = async (req, res) => {
    try {
        const { payment, order, cartData, paymentOrder } = req.body
        const crypto = require('crypto')

        let hmac = crypto.createHmac('sha256', process.env.secret_key)
        hmac = hmac.update(payment.razorpay_order_id + '|' + payment.razorpay_payment_id)
        hmac = hmac.digest('hex')

        if (hmac == payment.razorpay_signature) {
            await finalizeOrder(paymentOrder.newOrder, paymentOrder.user, paymentOrder.couponDiscount, paymentOrder.couponCode)

            // updating stock in productModel
            for (let item of cartData.items) {
                let sizeField = `size.${item.size}.quantity`
                await productModel.updateOne(
                    { _id: item.productId._id },
                    { $inc: { [sizeField]: -item.quantity } }
                )
            }
            // Delete cart data
            await cartModel.deleteOne({ userId: req.session.user._id })

            delete req.session.cartData

            // Update the specific order's payment status
            await orderModel.updateOne(
                {
                    userId: req.session.user._id,
                    'orders.orderId': order.receipt
                },
                {
                    $set: { 'orders.$.paymentStatus': 'successfull', 'orders.$.status': 'Processing' }
                }
            );

            return res.json({ paymentSuccess: true, message: 'Order is successfully placed' })
        } 
    } catch (error) {
        console.log(error);
    }
}

// Payment failiure handler
const paymentFailed = async (req, res) => {
    try {
        const { payment, order, cartData ,paymentOrder} = req.body

        await finalizeOrder(paymentOrder.newOrder, paymentOrder.user, paymentOrder.couponDiscount, paymentOrder.couponCode)

        const orderData = await orderModel.findOneAndUpdate(
            {
                userId: req.session.user._id,
                'orders.orderId': order.receipt
            },
            {
                $set: {
                    'orders.$.status': 'Payment pending',
                    'orders.$.paymentStatus': 'pending'
                }
            },
            { new: true }
        );

        await cartModel.deleteOne({ userId: req.session.user._id })
        delete req.session.cartData
        return res.json({ success: true, message: 'Payment failed!' })

    } catch (error) {
        console.log(error);
    }
}

const retryPayment = async (req, res) => {
    try {
        const orderId = req.query.orderId
        const orderData = await orderModel.aggregate([
            { $unwind: '$orders' },
            { $match: { 'orders.orderId': orderId } }
        ])

        const options = {
            amount: orderData[0].orders.totalPrice * 100,
            currency: 'INR',
            receipt: orderData[0].orders.orderId,
            payment_capture: 1,
        }
        const instance = new Razorpay({
            key_id: process.env.keyId,
            key_secret: process.env.secret_key
        })

        instance.orders.create(options, async (err, order) => {
            if (order && order.status === 'created') {
                return res.json({
                    status: 'razorpay',
                    order,
                    address: orderData[0].orders.address,
                    email: orderData[0].userEmail,
                });
            } else {
                console.log(err);
            }
        })

    } catch (error) {
        console.log(error);
    }
}

const verifyRetryPayment = async (req, res) => {
    try {
        const { payment, order } = req.body
        const crypto = require('crypto')
        console.log('entry');
        let hmac = crypto.createHmac('sha256', process.env.secret_key)
        hmac = hmac.update(payment.razorpay_order_id + '|' + payment.razorpay_payment_id)
        hmac = hmac.digest('hex')

        if (hmac == payment.razorpay_signature) {
            // const orderData = await orderModel.aggregate([
            //     {$match:{'orders.orderId': order.receipt}},
            //     {$set:{'orders.paymentStatus':'successfull'}}
            // ])
            const updatedOrder = await orderModel.updateOne(
                { 'orders.orderId': order.receipt },
                { $set: { 'orders.$.paymentStatus': 'successfull', 'orders.$.status': 'processing' } }
            );
            console.log('updateOrder=', updatedOrder);
            if (updatedOrder) {
                res.json({ success: true, message: 'Payment status updated' })
            } else {
                res.json({ success: false, message: 'Error found while updating payment status' })
            }
        } else {
            res.json({ payment: false, message: 'Error while verifying payment' })
        }
    } catch (error) {
        console.log(error);
    }
}

const orderSuccess = async (req, res) => {
    try {
        res.render('user/orderSuccess')
    } catch (error) {
        console.log(error);
    }
}

// view order list page
const viewOrderList = async (req, res) => {
    try {
        const user = req.session.user
        console.log('userId=',user._id);
        const userId = new mongoose.Types.ObjectId(user._id)
        const page = req.query.page || 1
        const limit = 5
        const skip = (page -1 ) * limit

        const orders = await orderModel.findOne({userId:userId})
        if(!orders){
            res.render('user/accountPage/page_ordersList',{user,orderData:null,currentPage:page,totalPages:0})
        }
        const totalOrders = orders.orders.length
        const totalPages = Math.ceil(totalOrders / limit)

        const orderData = await orderModel.aggregate([
            { $match: { userId: userId } },
            { $unwind: '$orders' },
            { $sort: { 'orders._id': -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    orders: { $push: '$orders' },
                },
            },
        ])

        if(orderData){
            res.render('user/accountPage/page_ordersList', { user, orderData ,currentPage:page,totalPages})
        }
    } catch (error) {
        console.log(error);
    }
}

// view order details page
const viewOrderDetails = async (req, res) => {
    try {
        const user = req.session.user;
        const orderId = req.query.orderId;

        const orderData = await orderModel.findOne({ userId: user._id });

        if (!orderData) {
            return res.render('user/404_page');
        }

        const orderDetails = orderData.orders.find(order => order._id == orderId);

        if (!orderDetails) {
            return res.render('user/404_page');
        }

        const subTotalPrice = orderDetails.products.reduce((acc, product) => acc + product.subTotalPrice, 0);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        res.render('user/accountPage/page_orderDetails', {
            user,
            orderDetails,
            orderId,
            subTotalPrice,
            sevenDaysAgo,
        });

    } catch (error) {
        console.error('Error viewing order details:', error);
        res.status(500).render('user/500_page', { error: 'Internal Server Error' });
    }
}

// cancel order
const cancelOrder = async (req, res) => {
    try {
        const orderId = req.body.orderId
        const user = req.session.user
        const userOrderData = await orderModel.findOne({ userId: user._id })
        const orders = userOrderData.orders.find(data => data._id == orderId)

        if (orders) {
            // update the stock in product db
            for (const product of orders.products) {
                const productId = product.productId
                const size = product.size;
                const quantity = product.quantity;
                const dbProduct = await productModel.findById(productId);
                if (!dbProduct) {
                    throw new Error("Product not found");
                }
                if (size === 'small') {
                    dbProduct.size.small.quantity += quantity;
                } else if (size === 'medium') {
                    dbProduct.size.medium.quantity += quantity;
                } else if (size === 'large') {
                    dbProduct.size.large.quantity += quantity;
                }
                await dbProduct.save();
            }

            if (orders.paymentStatus == 'successfull') {
                const wallet = await walletModel.findOne({ userId: user._id })
                let transaction = {
                    reference:orders.orderId,
                    amount: orders.totalPrice,
                    orderType: 'debit'
                }
                if (wallet) {
                    wallet.transactions.push(transaction)
                    wallet.balance += transaction.amount
                    await wallet.save()
                } else {
                    let balanceAmount = 0
                    balanceAmount += transaction.amount
                    const walletData = {
                        userId: user._id,
                        balance: balanceAmount,
                        transactions: transaction
                    }
                    const wallet = new walletModel(walletData)
                    await wallet.save()
                }
            }
            orders.status = 'Cancelled'
            orders.paymentStatus = 'returned'
            await userOrderData.save()
            res.json({ success: true })
        }
    } catch (error) {
        console.log(error);
    }
}

const returnOrder = async (req, res) => {
    try {
        const orderId = req.body.orderId
        const user = req.session.user
        const userOrderData = await orderModel.findOne({ userId: user._id })
        const orders = userOrderData.orders.find(data => data._id == orderId)

        if (orders) {
            // update the stock in product db
            for (const product of orders.products) {
                const productId = product.productId
                const size = product.size;
                const quantity = product.quantity;
                console.log('productId:', productId);
                const dbProduct = await productModel.findById(productId);
                if (!dbProduct) {
                    throw new Error("Product not found");
                }
                if (size === 'small') {
                    dbProduct.size.small.quantity += quantity;
                } else if (size === 'medium') {
                    dbProduct.size.medium.quantity += quantity;
                } else if (size === 'large') {
                    dbProduct.size.large.quantity += quantity;
                }
                await dbProduct.save();
            }

            if (orders.paymentStatus == 'successfull') {
                const wallet = await walletModel.findOne({ userId: user._id })
                let transaction = {
                    reference:orders.orderId,
                    amount: orders.totalPrice,
                    orderType: 'debit'
                }
                if (wallet) {
                    wallet.transactions.push(transaction)
                    wallet.balance += transaction.amount
                    await wallet.save()
                } else {
                    let balanceAmount = 0
                    balanceAmount += transaction.amount
                    const walletData = {
                        userId: user._id,
                        balance: balanceAmount,
                        transactions: transaction
                    }
                    const wallet = new walletModel(walletData)
                    await wallet.save()
                }
            }
            orders.status = 'Returned'
            orders.paymentStatus = 'returned'
            await userOrderData.save()
            res.json({ success: true })
        }
  
    }catch (error) {
        console.log(error);
    }
}

const viewInvoice = async (req, res) => {
    try {
        const orderId = req.query.orderId
        const orderDetails = await orderModel.aggregate([
            { $unwind: '$orders' },
            { $match: { 'orders.orderId': orderId } }
        ])
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        console.log(orderDetails[0]);
        return res.render('user/accountPage/invoice', { orderDetails: orderDetails[0], randomNum })
    } catch (error) {
        console.log(error);

    }
}

module.exports = {
    viewEditAddress,
    editAddress,
    viewAddAddress,
    addAddress,
    placeOrder,
    verifyPayment,
    paymentFailed,
    viewOrderList,
    orderSuccess,
    viewOrderDetails,
    cancelOrder,
    returnOrder,
    applyCoupon,
    viewInvoice,
    retryPayment,
    verifyRetryPayment,
}