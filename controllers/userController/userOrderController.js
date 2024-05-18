const userAddress = require('../../models/user/userAddressModel')

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

const viewAddAddress = async(req,res)=>{
    try {
        const userId = req.query.userId
        const user = req.session.user
        if(userId == user._id){
            res.render('user/page_checkoutAddAddress',{user,userId})
        }else{
            res.render('user/404_page')
        }
    } catch (error) {
        
    }
}

const addAddress = async(req,res)=>{
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

module.exports = {
    viewEditAddress,
    editAddress,
    viewAddAddress,
    addAddress,
}