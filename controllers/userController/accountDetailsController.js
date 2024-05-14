const User = require('../../models/user/user')
const bcrypt = require('bcrypt')

const viewUserAccDetails = async(req,res)=>{
    const user = req.session.user
    const users = await User.findOne({email:user.email})
    res.render('user/accountPage/page_accountDetails',{user:user,users:users})
}

const viewEditUserAccDetails = async(req,res)=>{
    try {
        const user = req.session.user
        const users = await User.findOne({email:user.email})
        res.render('user/accountPage/page_editAccountDetails',{user:user,users:users})
    } catch (error) {
        console.log('error found while viewing user account details edit page',error);
    }
}

const editUserAccDetails = async(req,res)=>{
    try {
        const {fname,lname,email,mobile,dob,cPassword} = req.body
        const dateFormatRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
        const checkDateFormat = dateFormatRegex.test(dob);
        if(checkDateFormat==false){
            res.json({dateErr:'*Invalid date Format (mm/dd/yyyy)'})
        }
        const formatedDob = new Date(dob)
        const userData = await User.findOne({email:email})
        const checkPassword = await bcrypt.compare(cPassword,userData.password)
        if(checkPassword){
            const updateData = await User.findByIdAndUpdate(userData._id,{$set:{
                firstname:fname,
                lastname:lname,
                email:email,
                mobile:mobile,
                dob:formatedDob
            }},{new:true})
            if(updateData){
                return res.json({success:true})
            }else{
                return res.json({success:false})
            }
        }else{
            return res.json({error:'*password not matched'})
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    viewUserAccDetails,
    viewEditUserAccDetails,
    editUserAccDetails
}