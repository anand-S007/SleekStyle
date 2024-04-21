const User = require('../../models/user/user')

const isBlocked = async(req,res,next)=>{
    try {
    const checkIsVerified = await User.findOne({email:req.session.user.email},{isVerified:1})
    if(checkIsVerified.isVerified){
        next()
        console.log('user not blocked middleware checked');
    }else{
        req.session.destroy()
        res.redirect('/login')
    } 
    } catch (error) {
        console.log('Error found while isBlocked middleware checking users isVerified true or not',error);
    }
}

module.exports = isBlocked