
const viewUserAccount = (req,res)=>{
    res.render('user/page-account')
}

const logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/login')
    } catch (error) {
            console.log('errror at logout',error);
    }
}

module.exports ={
    viewUserAccount,
    logout,
}