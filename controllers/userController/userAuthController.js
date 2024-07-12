const User = require('../../models/user/user')
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
require('dotenv').config()
const bcrypt = require('bcrypt')
const passport = require('passport')


// view user login page
const viewUserLogin = async (req, res) => {
    try {
        let user
        req.session.user ? user = req.session.user : null
        res.render('user/userAuthPages/page-login-register', { user })
    } catch (error) {
        console.error(error, 'error found at view login');
    }

}

//Forgot password
const viewForgotPass = async (req, res) => {
    try {
        res.render('user/userAuthPages/page-forgotPassword')
    } catch (error) {
        console.log(error);
    }
}
const forgotPass = async (req, res) => {
    try {
        const email = req.body.email
        const emailExist = await User.findOne({ email: email })
        if (emailExist) {
            const otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            })
            console.log('otp is:', otp);
            req.session.forgPassOtp = otp
            setTimeout(() => {
                delete req.session.forgPassOtp
            }, 30000)
            const otpSend = await sendOtpMail(email, otp)
            if (otpSend) {
                req.session.forgPass_email = email
                return res.json({ success: true })
            }
        } else {
            return res.json({ success: false, message: '*Email is not exist' })
        }
    } catch (error) {
        console.log(error);
    }
}
// view otp page of forgot password
const viewForgPassOtpVerify = async (req, res) => {
    try {
        if (req.session.forgPass_email) {
            res.render('user/userAuthPages/page-otpForgPass')
        }
    } catch (error) {
        console.log(error);
    }
}
const forgotPassOtpVerify = async (req, res) => {
    try {
        const otp = req.body.verifyOtp
        const forgPassOtp = req.session.forgPassOtp
        console.log('otp=', otp, 'forgpassotp=', forgPassOtp);
        if (otp == forgPassOtp) {
            res.json({ success: true, message: 'Verified successfully!' })
        } else {
            res.json({ error: true, message: 'Otp is not valid/expired!' })
        }
    } catch (error) {
        console.log(error);
    }
}
// view confirm forgot password 
const viewForgConfirmPass = async (req, res) => {
    try {
        if (req.session.forgPass_email) {
            res.render('user/userAuthPages/page-forgConfirmPass')
        } else {
            console.error('error found');
        }
    } catch (error) {
        console.log(error);
    }
}
const changePassword = async (req, res) => {
    try {
        const newPassword = req.body.newPassword
        const userData = await User.findOne({ email: req.session.forgPass_email })
        if (userData) {
            const hashedPassword = await createHashPassword(newPassword)
            userData.password = hashedPassword
            await userData.save()
            delete req.session.forgPass_email
            delete req.session.forgPassOtp
            return res.json({ success: true })
        } else {
            res.json({ success: false, message: '*User not found!' })
        }

    } catch (error) {
        console.log(error);
    }
}

// logging in user
const userLogin = async (req, res) => {
    try {
        const password = req.body.password
        const userData = await User.findOne({ email: req.body.email })
        if (!userData) {
            res.status(404).json({ emailError: 'User not found. Enter valid email' })
        }
        const passwordMatch = await bcrypt.compare(password, userData.password)
        if (passwordMatch) {
            const checkIsVerified = await User.findOne({ email: req.body.email }, { isVerified: 1 })
            if (checkIsVerified.isVerified == true) {
                req.session.user = userData
                res.json({ success: true })
            } else {
                res.json({ block: '*Acoount is currently suspended' })
            }
        } else {
            console.log('password not matched while login');
            res.status(400).json({ passwordError: '*Password is incorrect. Try agian' })
        }
    } catch (error) {
        console.log('error found while user login', error);
    }
}

const userGoogleLogin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
});

// user logout 
const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login')
    } catch (error) {
        console.log('errror at logout', error);
    }
}

// view user signup page
const viewUserSignup = (req, res) => {
    let user
    req.session.user ? user = req.session.user : null
    res.render('user/userAuthPages/signup-page.ejs',{user})
}

// function for Create hashed password
const createHashPassword = async (password) => {
    try {
        return hashPass = bcrypt.hash(password, 10)
    } catch (error) {
        if (error) {
            console.log('error found while hasing password', error);
        }
    }
}

// user signup
const signup = async (req, res) => {
    try {

        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        const hashPassword = await createHashPassword(password)
        const checkEmailExist = await User.findOne({ email: req.body.email })
        if (checkEmailExist) {
            console.log('email exists');
            res.status(400).json({ error: '*Email already exists,Please login' })
        } else {
            if (password == confirmPassword) {
                const signupData = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    dob: req.body.dob,
                    password: hashPassword,
                    isAdmin: 0,
                }

                req.session.tempSaveUser = signupData
                const otp = otpGenerator.generate(6, {
                    digits: true,
                    lowerCaseAlphabets: false,
                    upperCaseAlphabets: false,
                    specialChars: false
                })
                console.log('otp is:', otp);
                req.session.otp = otp;
                setTimeout(() => {
                    req.session.otp = null
                }, 60000)
                const otpSend = await sendOtpMail(signupData.email, otp)
                if (otpSend) {
                    res.status(200).json({ message: 'Registered Successfully' })
                } else {
                    console.log('something went wrong while otp send in signup');
                }
            } else {
                res.status(404).json({ passwordMatchError: '*password is not matched' })
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// Function to send otp to mail
const sendOtpMail = async function (email, otp) {
    try {
        const otpTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.email,
                pass: process.env.password,
            }
        })
        const mailOptions = {
            from: "sleek-style@gmail.com",
            to: email,
            subject: 'OTP for account verification',
            text: `otp for account verification is ${otp}`
        }
        return await otpTransporter.sendMail(mailOptions)
    } catch (error) {
        console.log('error while sending otp to mail', error);
    }
}

// view otp page 
const viewOtpVarify = async (req, res) => {
    try {
        res.render('user/userAuthPages/otp-verify.ejs')
    } catch (error) {
        console.log(error);
    }
}

// user otp verification
const otpVerification = async (req, res) => {
    try {
        const otp = req.session.otp
        const verifyOtp = req.body.verifyOtp
        if (otp == verifyOtp) {
            const tempUser = req.session.tempSaveUser
            const user = new User(tempUser)
            const result = await user.save()
            if (result) {
                await User.findOneAndUpdate({ _id: result._id }, { isVerified: true })
                delete req.session.otp
                delete req.session.tempSaveUser
                res.status(200).json({ message: 'Otp verified' })
            }
        } else {
            console.log('otp is not verifying');
            res.status(404).json({ error: '*OTP is expired/not valid' })
        }
    } catch (error) {
        console.log('error found while verifying otp', error);
    }
}

// User resend otp
const resendOtp = async (req, res) => {
    try {
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })
        req.session.otp = otp;
        setTimeout(() => {
            req.session.otp = null
        }, 60000)
        const userMail = req.session.tempSaveUser.email
        const isOtpSend = await sendOtpMail(userMail, otp)
        if (isOtpSend) {
            res.redirect('/otp-verify')
        } else {
            res.redirect('/signup')
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    viewUserLogin,
    userLogin,
    userGoogleLogin,
    logout,
    viewUserSignup,
    signup,
    viewOtpVarify,
    otpVerification,
    viewForgotPass,
    resendOtp,
    forgotPass,
    viewForgPassOtpVerify,
    forgotPassOtpVerify,
    viewForgConfirmPass,
    changePassword,
}