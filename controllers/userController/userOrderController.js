const userAddress = require('../../models/user/userAddressModel')
const cartModel = require('../../models/user/cartSchema')
const productModel = require('../../models/admin/productSchema')
const orderModel = require('../../models/user/orderModel')
const { v4: uuidv4 } = require('uuid')
const { default: mongoose } = require('mongoose')
const Razorpay = require('razorpay')
const instance = new Razorpay({key_id:process.env.keyId, key_secret:process.env.secret_key})


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
const placeOrder = async (req, res) => {
    try {
        const user = req.session.user
        const { cartId, selectedAddressId, paymentMethod } = req.body
        const uuid = uuidv4()
        const truncateUuid = uuid.substring(0, 6)

        if (!cartId == '') {
            // const cartData = await cartModel.findOne({ _id: cartId }).populate('items.productId')
            const cartData = await cartModel.findOne({ _id: cartId })
                .populate({
                    path: 'items.productId',
                    populate: {
                        path: 'category',
                        model: 'category'
                    }
                })
                .exec();
            if (paymentMethod == 'cod') {
                const addressData = await userAddress.findOne({ userId: req.session.user._id })
                const deliveryAddress = addressData.addresses.find((data) => {
                    return data._id == selectedAddressId
                })
                const userOrder = await orderModel.findOne({ userId: user._id })
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
                const newOrder = {
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
                    paymentMethod: 'cod',
                    totalPrice: cartData.totalPrice,
                    status: 'processing',
                    orderId: `ORD${truncateUuid}`
                }

                if (userOrder) {
                    userOrder.orders.push(newOrder)
                    await userOrder.save()
                }
                else {
                    const newOrderDocument = new orderModel({
                        userId: user._id,
                        userEmail: user.email,
                        orders: [newOrder],
                    })
                    await newOrderDocument.save();
                }
                for (const item of cartData.items) {
                    const sizeField = `size.${item.size}.quantity`
                    await productModel.updateOne(
                        { _id: item.productId._id },
                        { $inc: { [sizeField]: -item.quantity } }
                    )
                }
                await cartModel.deleteOne({ userId: user._id })

                res.json({ success: true, message: 'Order is successfully placed' })
                delete req.session.cartData
            }
            else{
                
            }
        } else {
            res.json({ message: 'no products' })
            console.log('no products');
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
        const userId = new mongoose.Types.ObjectId(user._id)
        const page = req.query.page || 0
        const skip = page * 5
        console.log('page=',page ,'', 'skip=',skip);
        // const orderData = await orderModel.findOne({ userId: user._id }).sort({ 'orders._id': 1 })
        const orderData = await orderModel.aggregate([
            { $match: { userId: userId } },
            { $unwind: '$orders' },
            { $sort: { 'orders._id': -1 } },
            {$limit:5},
            {$skip:skip},
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
}