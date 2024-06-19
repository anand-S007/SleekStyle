const userAddress = require('../../models/user/userAddressModel')
const cartModel = require('../../models/user/cartSchema')
const productModel = require('../../models/admin/productSchema')
const orderModel = require('../../models/user/orderModel')
const couponModel = require('../../models/admin/couponModel')
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
                    console.log('discountPercent', discountPercent, 'totalPrice:', cartData.totalPrice, 'maxDiscount:', maxDiscount);
                    const discountAmount = (discountPercent * cartData.totalPrice) / 100
                    let finalDiscount = discountAmount
                    if (discountAmount > maxDiscount) {
                        finalDiscount = maxDiscount
                    }
                    // cartData.totalPrice -= finalDiscount
                    // cartData.coupon.code = couponData.code
                    // cartData.coupon.discount = finalDiscount
                    // await cartData.save()
                    // couponData.redeemedUser.push(user._id)
                    // couponData.usedCount += 1
                    // await couponData.save()

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

// place order
// const placeOrder = async (req, res) => {
//     try {
//         const user = req.session.user
//         const { cartId, selectedAddressId, paymentMethod, couponCode, couponDiscount, totalPrice } = req.body
//         const uuid = uuidv4()
//         const truncateUuid = uuid.substring(0, 6)

//         if (!cartId == '') {
//             const cartData = await cartModel.findOne({ _id: cartId })
//                 .populate({
//                     path: 'items.productId',
//                     populate: {
//                         path: 'category',
//                         model: 'category'
//                     }
//                 })
//                 .exec();
//             const addressData = await userAddress.findOne({ userId: req.session.user._id })
//             const deliveryAddress = addressData.addresses.find((data) => {
//                 return data._id == selectedAddressId
//             })
//             const userOrder = await orderModel.findOne({ userId: user._id })
//             const orderItems = cartData.items.map((item) => {
//                 return {
//                     productId: item.productId._id,
//                     name: item.productId.title,
//                     description: item.productId.description,
//                     category: item.productId.category.name,
//                     image: item.productId.image[0],
//                     size: item.size,
//                     quantity: item.quantity,
//                     proPrice: item.proPrice,
//                     subTotalPrice: item.subTotalPrice
//                 }
//             })
//             let newOrder
//             if (paymentMethod == 'cod') {
//                 newOrder = {
//                     products: orderItems,
//                     address: {
//                         name: deliveryAddress.name,
//                         mobile: deliveryAddress.mobile,
//                         pincode: deliveryAddress.pincode,
//                         locality: deliveryAddress.locality,
//                         address: deliveryAddress.address,
//                         district: deliveryAddress.district,
//                         state: deliveryAddress.state
//                     },
//                     paymentMethod: 'cod',
//                     couponDiscountAmount: couponDiscount ? couponDiscount : null,
//                     totalPrice,
//                     status: 'processing',
//                     orderId: `ORD${truncateUuid}`
//                 }
//             }
//             // Razorpay payment
//             else if (paymentMethod == 'razorpay') {
//                 newOrder = {
//                     products: orderItems,
//                     address: {
//                         name: deliveryAddress.name,
//                         mobile: deliveryAddress.mobile,
//                         pincode: deliveryAddress.pincode,
//                         locality: deliveryAddress.locality,
//                         address: deliveryAddress.address,
//                         district: deliveryAddress.district,
//                         state: deliveryAddress.state
//                     },
//                     paymentMethod: 'razorpay',
//                     totalPrice: cartData.totalPrice,
//                     status: 'processing',
//                     orderId: `ORD${truncateUuid}`
//                 }
//                 const options = {
//                     amount: cartData.totalPrice * 100,
//                     currency: 'INR',
//                     receipt: newOrder.orderId,
//                     payment_capture: 1,
//                 }
//                 instance.orders.create(options, (err, order) => {
//                     if (order && order.status === 'created') {
//                         console.log('order details=', order);
//                         return res.json({
//                             status: 'razorpay',
//                             order,
//                             address: newOrder.address,
//                             couponCode,
//                         });
//                     } else {
//                         console.log(err);
//                     }
//                 })
//             }
//             // If user already placed order push newOrder to orders
//             if (userOrder) {
//                 userOrder.orders.push(newOrder)
//                 await userOrder.save()
//             }
//             // Creating new order
//             else {
//                 const newOrderDocument = new orderModel({
//                     userId: user._id,
//                     userEmail: user.email,
//                     orders: [newOrder],
//                 })
//                 await newOrderDocument.save();
//             }
//             if (couponDiscount && couponCode) {
//                 const coupon = await couponModel.findOne({ code: couponCode })
//                 if (coupon) {
//                     coupon.redeemedUser.push(user._id)
//                     coupon.usedCount += 1
//                     await coupon.save()
//                 }
//             }
//             // updating stock in productModel
//             for (const item of cartData.items) {
//                 const sizeField = `size.${item.size}.quantity`
//                 await productModel.updateOne(
//                     { _id: item.productId._id },
//                     { $inc: { [sizeField]: -item.quantity } }
//                 )
//             }
//             // Delete cart data
//             await cartModel.deleteOne({ userId: user._id })

//             res.json({ success: true, message: 'Order is successfully placed' })
//             delete req.session.cartData
//         } else {
//             res.json({ success: false, message: 'Cart is empty' })
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

const placeOrder = async (req, res) => {
    try {
        const user = req.session.user
        const { cartId, selectedAddressId, paymentMethod, couponCode, couponDiscount, totalPrice } = req.body

        const uuid = uuidv4()
        const truncateUuid = uuid.substring(0, 6)

        if(!cartId){
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
            
            // Delivery address
            const userAddress = await userAddress.findOne(
                { 
                    userId: req.session.user._id ,
                    addresses: {$elemMatch:{_id:selectedAddressId}}
                },
                {'addresses.$':1}
            )
            const deliveryAddress = userAddress.addresses[0]

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
                await finalizeOrder(newOrder,user,cartData,couponDiscount,couponCode)
                res.json({ success: true, message: 'Order is successfully placed' })
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
                    key_id: 'rzp_test_m0dRXZ082qPP0X', 
                    key_secret: '0NGUJxkPWR3MxCtpwmXrvNwe'
                })

                instance.orders.create(options, async(err, order) => {
                    if (order && order.status === 'created') {
                        console.log('order details=', order);
                        await finalizeOrder(newOrder,user,cartData,couponDiscount,couponCode)
                        return res.json({
                            status: 'razorpay',
                            order,
                            address: newOrder.address,
                            couponCode,
                        });
                    } else {
                        console.log(err);
                    }
                })
            }
               
    } catch (error) {
        console.log(error);
    }
}
// function to create order
async function finalizeOrder(newOrder,user,cartData,couponDiscount,couponCode){
    try {
        const userOrder = await orderModel.findOne({userId:user._id})
        if(userOrder){
            // If user already placed order push newOrder to orders
            userOrder.orders.push(newOrder)
            await userOrder.save()
        }else{
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
        const userId = new mongoose.Types.ObjectId(user._id)
        const page = req.query.page || 0
        const skip = page * 5
        console.log('page=', page, '', 'skip=', skip);
        // const orderData = await orderModel.findOne({ userId: user._id }).sort({ 'orders._id': 1 })
        const orderData = await orderModel.aggregate([
            { $match: { userId: userId } },
            { $unwind: '$orders' },
            { $sort: { 'orders._id': -1 } },
            { $limit: 5 },
            { $skip: skip },
            {
                $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    orders: { $push: '$orders' },
                },
            },
        ])
        if (orderData) {
            res.render('user/accountPage/page_ordersList', { user, orderData })
        }
    } catch (error) {
        console.log(error);
    }
}

// view order details page
const viewOrderDetails = async (req, res) => {
    try {
        const user = req.session.user
        const orderId = req.query.orderId
        console.log(orderId);
        const orders = await orderModel.findOne({ userId: user._id }).populate('userId')
        const orderDetails = orders.orders.find(data => data._id == orderId)
        if (orderDetails) {
            res.render('user/accountPage/page_orderDetails', { user, orderDetails, orderId })
        } else {
            res.render('user/404_page')
        }
    } catch (error) {
        console.log(error);
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
            orders.status = 'Cancelled'
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
            orders.status = 'Returned'
            await userOrderData.save()
            res.json({ success: true })
        }
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
    viewOrderList,
    orderSuccess,
    viewOrderDetails,
    cancelOrder,
    returnOrder,
    applyCoupon,
}