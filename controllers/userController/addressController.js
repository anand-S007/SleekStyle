const userAddress = require('../../models/user/userAddressModel')

const viewAddress = async(req,res)=>{
    try {
        const address = await userAddress.find({})
        let count = 1
        res.render('user/accountPage/viewUserAddress',{user:req.session.user,address:address,count:count})
    } catch (error) {
    console.log('error found while viewing user address',error);       
    }
}

const viewAddAddress = async(req,res)=>{
    try {
        res.render('user/accountPage/userAddAddress',{user:req.session.user})
    } catch (error) {
        console.log('error found while view add address page',error);
    }
}

const addAddress = async(req,res)=>{
    try {
        const {name,phone,pincode,locality,address,district,state} = req.body
        const checkAddressExist = await userAddress.find({address:address})
        if(checkAddressExist.length>0){
            res.json({addressExistError:'Address already exists'})
        }else{
            const user_address = new userAddress({name,mobile:phone,pincode,locality,address,district,state})
            const saveAddress = await user_address.save()
            if(saveAddress){
                res.json({success:true})
                console.log('entry');
            }else{
                res.status(404).json({saveFailedError:'user saving failed'})
                console.log('user adress not saved');
            }
        }
        // res.redirect('/user_account/address')
    } catch (error) {
        console.log('error found while adding user address',error);
    }
}

const deleteAddress = async(req,res)=>{
    const addressId = req.params.id 
    await userAddress.findOneAndDelete({_id:addressId})
    res.json({success:true})
}

const viewEditAddress = async(req,res)=>{
    const addressId = req.params.id
    const address = await userAddress.findOne({_id:addressId})
    res.render('user/accountPage/page_editAddress',{user:req.session.user,address:address})
}

const editAddress = async(req,res)=>{
    const addressId = req.params.id
    const {name,phone,pincode,locality,address,district,state} = req.body
    const updateAddress = {name,mobile:phone,pincode,locality,address,district,state}
    const updatedAddress = await userAddress.findByIdAndUpdate(addressId,updateAddress,{new:true})
    if(updatedAddress){
        res.status(200).json({ success: true, message: "Address updated successfully" });
    }else{
        res.status(404).json({ success: false, message: "Address not found" });
    }

}

module.exports ={
    viewAddress,
    viewAddAddress,
    addAddress,
    deleteAddress,
    viewEditAddress,
    editAddress
}