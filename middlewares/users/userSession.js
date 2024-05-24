const User = require('../../models/user/user')

const isLogout = (req,res,next)=>{
    if(req.session && req.session.user){
        res.redirect('/')
    }else{
        next()
        console.log('no session');
    }
}

const isLogin = (req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.redirect('/login')
        console.log('no session');
    }
}

const checkCartData = (req,res,next)=>{
    if(req.session.cartData){
        next()
    }else{
        res.redirect('/viewcart')
    }
}



module.exports = {isLogout,isLogin,checkCartData}