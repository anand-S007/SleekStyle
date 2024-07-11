const orderModel = require('../../models/user/orderModel')

const viewSalesReport = async (req, res) => {
    try {
        const admin = req.session.admin
        const filter = req.query.filter
        const fromDate = req.query.from
        const toDate = req.query.to

        let orderData

        // filter order based of from and to date
        if (fromDate && toDate) {
            const fromDateObj = new Date(fromDate);
            const toDateObj = new Date(toDate);

            toDateObj.setHours(23, 59, 59, 999);

            orderData = await orderModel.aggregate([
                { $unwind: '$orders' },
                {
                    $match: {
                        $and: [
                            { 'orders.status': 'Delivered' },
                            { 'orders.paymentStatus': 'successfull' },
                            {
                                'orders.createdAt': {
                                    $gte: fromDateObj,
                                    $lte: toDateObj
                                }
                            }
                        ]
                    }
                },
                { $sort: { 'orders._id': -1 } }
            ]);

        } else {
            switch (filter) {
                case 'day':
                    const twentyFourHrsAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
                    orderData = await orderModel.aggregate([
                        { $unwind: '$orders' },
                        {
                            $match: {
                                $and: [
                                    { 'orders.status': 'Delivered' },
                                    { 'orders.paymentStatus': 'successfull' },
                                    { 'orders.createdAt': { $gte: twentyFourHrsAgo } }
                                ]
                            }
                        },
                        { $sort: { 'orders._id': -1 } }
                    ])
                    break;
                case 'week':
                    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    orderData = await orderModel.aggregate([
                        { $unwind: '$orders' },
                        {
                            $match: {
                                $and: [
                                    { 'orders.status': 'Delivered' },
                                    { 'orders.paymentStatus': 'successfull' },
                                    { 'orders.createdAt': { $gte: oneWeekAgo } }
                                ]
                            }
                        },
                        { $sort: { 'orders._id': -1 } }
                    ])
                    break;
                case 'month':
                    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    orderData = await orderModel.aggregate([
                        { $unwind: '$orders' },
                        {
                            $match: {
                                $and: [
                                    { 'orders.status': 'Delivered' },
                                    { 'orders.paymentStatus': 'successfull' },
                                    { 'orders.createdAt': { $gte: oneMonthAgo } }
                                ]
                            }
                        },
                        { $sort: { 'orders._id': -1 } }
                    ])
                    break;
                case 'year':
                    const oneYearAgo = new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)
                    orderData = await orderModel.aggregate([
                        { $unwind: '$orders' },
                        {
                            $match: {
                                $and: [
                                    { 'orders.status': 'Delivered' },
                                    { 'orders.paymentStatus': 'successfull' },
                                    { 'orders.createdAt': { $gte: oneYearAgo } }
                                ]
                            }
                        },
                        { $sort: { 'orders._id': -1 } }
                    ])
                    break;
                default:
                    orderData = await orderModel.aggregate([
                        { $unwind: '$orders' },
                        {
                            $match: {
                                $and: [
                                    { 'orders.status': 'Delivered' },
                                    { 'orders.paymentStatus': 'successfull' }
                                ]
                            }
                        },
                        { $sort: { 'orders._id': -1 } }
                    ])
                    break;
            }
        }

        const salesReport = calculateOveralSummary(orderData)
        return res.render('admin/admin_salesReport', {
            admin,
            orderData,
            salesReport,
        })
    } catch (error) {
        console.log(error);
    }
}

function calculateOveralSummary(order){
    let totalSalesCount = 0
    let totalOrderAmount = 0
    let totalCouponDiscount = 0

    order.forEach((data)=>{
        totalSalesCount++
        totalOrderAmount += data.orders.totalPrice
        if(data.orders.couponDiscountAmount){
            totalCouponDiscount += data.orders.couponDiscountAmount
        }
    })
    return {
        totalSalesCount,
        totalOrderAmount,
        totalCouponDiscount
    }
}


module.exports = {
    viewSalesReport
}