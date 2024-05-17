const userAddress = require('../../models/user/userAddressModel')

// view user address page 
const viewAddress = async (req, res) => {
    try {
        let user = req.session.user
        const address = await userAddress.findOne({ userId: user._id })
        if (address) {
            let count = 1
            res.render('user/accountPage/viewUserAddress', { user, address: address, count })
        } else {
            res.render('user/accountPage/viewUserAddress', { user, address: null, count })
        }
    } catch (error) {
        console.log('error found while viewing user address', error);
    }
}

// view add address page
const viewAddAddress = async (req, res) => {
    try {
        res.render('user/accountPage/userAddAddress', { user: req.session.user })
    } catch (error) {
        console.log('error found while view add address page', error);
    }
}

// add user address
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
                // const user_address = new userAddress({ name, mobile: phone, pincode, locality, address, district, state })
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
        console.log('error found while adding user address', error);
    }
}

// User delete address
const deleteAddress = async (req, res) => {
    try {
        console.log('entry to delete address');
        const addressId = req.body.addressId
        const userAddressData = await userAddress.findOne({ userId: req.session.user._id })
        const findAddress = userAddressData.addresses.find((data) => data._id == addressId)
        if (findAddress) {
            userAddressData.addresses.pull(findAddress)
            const addressSaved = await userAddressData.save()
            if (addressSaved) {
                res.json({ success: true })
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// view user edit address
const viewEditAddress = async (req, res) => {
    const addressId = req.params.id
    const user = req.session.user
    const userAddressData = await userAddress.findOne({ userId: user._id })
    const addresses = userAddressData.addresses.find((item) => item._id == addressId)
    res.render('user/accountPage/page_editAddress', { user, addresses })
}

// User account page edit address
const editAddress = async (req, res) => {
    try {
        const addressId = req.params.id
        const { name, phone, pincode, locality, address, district, state } = req.body
        console.log(req.body);
        const newAddress = { name, mobile: phone, pincode, locality, address, district, state }
        const userAddresses = await userAddress.findOne({ userId: req.session.user._id })
        const addressIndex = userAddresses.addresses.findIndex((data) => data._id == addressId)
        userAddresses.addresses[addressIndex] = newAddress
        const updatedAddress = await userAddresses.save()
        if (updatedAddress) {
            res.status(200).json({ success: true, message: "Address updated successfully" });
        } else {
            res.status(404).json({ success: false, message: "Address not found" });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    viewAddress,
    viewAddAddress,
    addAddress,
    deleteAddress,
    viewEditAddress,
    editAddress
}