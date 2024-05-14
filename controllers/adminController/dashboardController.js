const User = require('../../models/user/user')

const viewDashBoard = async (req, res) => {

    res.render('admin/dashboard', { admin: req.session.admin })
}

const viewUsersList = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false })
        res.render('admin/userManagement/usersList', { admin: req.session.admin, users: users })
    } catch (error) {
        console.log('error found while rendering users list', error);
    }
}

module.exports = {
    viewDashBoard,
    viewUsersList,
}