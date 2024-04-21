const User = require('../../models/user/user')
const bcrypt = require('bcrypt')

const viewLogin = async(req,res)=>{
    try {
        res.render('admin/adminLogin',{admin:req.session.admin})
    } catch (error) {
        console.log('error at admin login load',error);
    }
}

const adminLogin = async(req,res)=>{
    try {  
        const checkAdmin = await User.findOne({email:req.body.email})        
        if(checkAdmin.isAdmin==true){
            const passwordMatch = await bcrypt.compare(req.body.password,checkAdmin.password)
            if(passwordMatch){
                req.session.admin = checkAdmin
                res.redirect('/admin')
            }else{
                res.redirect('/admin/login')
                console.log('password not matched while admin login');
            }
        }else{
            res.redirect('/admin/login')
            console.log('admin is not verified');
        }

    } catch (error) {
        console.log('error while admin login',error);
    }
}

const adminLogout = async(req,res)=>{
    try {
        console.log('admin logout');
        req.session.destroy((error)=>{
            if(error){
                console.log('error while destroying admin session in logout',error);
            }else{
                res.redirect('/admin/login')
            }
        })
    } catch (error) {
        console.log('Error while admin logout',error);
    }
}



module.exports = {
    viewLogin,
    adminLogin,
    adminLogout
}

