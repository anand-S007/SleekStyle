const orderModel = require('../../models/user/orderModel')
const productModel = require('../../models/admin/productSchema')
const walletModel = require('../../models/user/walletModel')

const viewOrderList = async (req, res) => {
    try {
        const admin = req.session.admin
        const page = req.query.page || 1
        const limit = 6
        const skip = (page -1)*limit

        const allOrders = await orderModel.aggregate([
            {$unwind:'$orders'}
        ])
        const totalOrders = allOrders.length
        const totalPages = Math.ceil(totalOrders/limit)
        console.log('page=',page);

        const orderData = await orderModel.aggregate([
            { $unwind: '$orders' },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $addFields: {
                    'orders.userDetails': { $arrayElemAt: ['$userDetails', 0] }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    orders: { $push: '$orders' },
                    userId: { $first: '$userId' },
                    userDetails: { $first: '$userDetails' }
                },
            },
            {$unwind:'$orders'},
            { $sort: { 'orders.createdAt': -1 } },
            { $skip: skip },
            { $limit: limit },
        ]);

        console.log('totalPages',totalPages);
        if (orderData) {
            res.render('admin/orderManagement/adminPage-ordersList', { 
                admin, 
                orderData,
                totalPages,
                currentPage:page
            })
        }
    } catch (error) {
        console.log(error);
    }
}

const viewOrderDetail = async (req, res) => {
    const admin = req.session.admin
    const { userId, orderId } = req.query
    const orders = await orderModel.findOne({ userId: userId }).populate('userId')
    const orderDetails = orders.orders.find(data => data._id == orderId)
    if (orderDetails) {
        res.render('admin/orderManagement/adminPage-orderDetail', { admin, orderDetails, userData: orders.userId, orderId })
    }
}

const changeStatus = async(req,res)=>{
    try {
        console.log('entry');
        const {status,orderId,userId} = req.body

        const userOrders = await orderModel.findOne({ userId: userId }).populate({
            path: 'orders.products.productId',
            model: 'product'
        });
        const orders = userOrders.orders.find(data=>data._id == orderId)
        // console.log('orders=',orders);
        if(status == 'cancelled' || status == 'Returned' ){
            if(orders.paymentStatus == 'successfull' || orders.paymentStatus == 'Successfull'){
                console.log('entry to asfdasdfa');
                const wallet = await walletModel.findOne({userId:userId})
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
                        userId: userId,
                        balance: balanceAmount,
                        transactions: transaction
                    }
                    const wallet = new walletModel(walletData)
                    await wallet.save()
                }
                const walletData = await walletModel.findOne({userId:userId})
                console.log('walletData=',walletData);
            }
            for (const product of orders.products) {
                const productId = product.productId._id;
                const productQuantity = product.quantity;

                // Find the product by ID and update its quantity
                await productModel.findByIdAndUpdate(productId, {
                    $inc: { 'size.small.quantity': product.size === 'small' ? productQuantity : 0,
                            'size.medium.quantity': product.size === 'medium' ? productQuantity : 0,
                            'size.large.quantity': product.size === 'large' ? productQuantity : 0 }
                });
            }
        }else if(status == 'Delivered'){
            orders.paymentStatus = 'successfull'
        }
        if(orders){
            orders.status = status
            await userOrders.save()
            res.json({success:true,status})
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    viewOrderList,
    viewOrderDetail,
    changeStatus,
}