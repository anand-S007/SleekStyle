const User = require('../../models/user/user')
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
require('dotenv').config()
const bcrypt = require('bcrypt')


// view home page
const viewHomePage = async(req,res)=>{
    try {
        res.render('user/home',{user:req.session.user})
        console.log('enterded home ');
    } catch (error) {
        console.log(error,'error found while viewing home page');
    }
}

// view user login page
const viewUserLogin = async(req,res)=>{
    try{
        res.render('user/page-login-register.ejs')
    }catch(error){
        console.error(error,'error found at view login');
    }
    
}

// logging in user
const userLogin = async(req,res)=>{
    try {
        const password = req.body.password
        console.log(req.body.email);
        const userData = await User.findOne({email:req.body.email})
        console.log(userData);
        if(!userData){
            res.status(404).json({emailError:'User not found. Enter valid email'})
        }
        const passwordMatch = await bcrypt.compare(password,userData.password)
        if(passwordMatch){
            const checkIsVerified = await User.findOne({email:req.body.email},{isVerified:1})
            if(checkIsVerified.isVerified==true){
                req.session.user = userData
                res.json({success:true})
            }else{
                res.json({block:'*Acoount is currently suspended'})
            }
        }else{
            console.log('password not matched while login');
            res.status(400).json({passwordError:'*Password is incorrect. Try agian'})
        }
    } catch (error) {
            console.log('error found while user login',error);
    }
}

// view user signup page
const viewUserSignup = (req,res)=>{
    res.render('user/signup-page.ejs')
}

// function for Create hashed password
const createHashPassword = async(password)=>{
    try {
        return hashPass = bcrypt.hash(password,10)
    } catch (error) {
        if(error){
            console.log('error found while hasing password',error);
        }
    }
}

const signup = async(req,res)=>{
    try {

        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        const hashPassword = await createHashPassword(password)
        const checkEmailExist = await User.findOne({email:req.body.email})
        if(checkEmailExist){
            console.log('email exists');
            res.status(400).json({error:'*Email already exists,Please login'})
        }else{
            if(password == confirmPassword){
                const signupData = {
                    firstname:req.body.firstname,
                    lastname:req.body.lastname,
                    email:req.body.email,
                    mobile:req.body.mobile,
                    dob:req.body.dob,
                    password:hashPassword,
                    isAdmin:0,
                }
                            // const user = new User(signupData)
                            req.session.tempSaveUser = signupData
                                const otp = otpGenerator.generate(6,{digits:true,
                                                                lowerCaseAlphabets:false,
                                                                upperCaseAlphabets:false,
                                                                specialChars:false})
                                req.session.otp = otp;
                                setTimeout(()=>{
                                    req.session.otp = null
                                 },60000)
                                await sendOtpMail(signupData.email,otp)
                            
                                res.status(200).json({message:'Registered Successfully'})
            }else{
                res.status(404).json({passwordMatchError:'*password is not matched'})
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// Function to send otp to mail
const sendOtpMail = async function(email,otp){
    try {
        const otpTransporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.email,
                pass:process.env.password,
            }
        })
        const mailOptions = {
            from:"sleek-style@gmail.com",
            to:email,
            subject:'OTP for account verification',
            text:`otp for account verification is ${otp}`
        }
        await otpTransporter.sendMail(mailOptions)
    } catch (error) {
        if(error){
            console.log('error while sending otp to mail',error);
        }
    }
}

// view otp page 
const viewOtpVarify = async(req,res)=>{
    res.render('user/otp-verify.ejs')
}


const otpVerification = async(req,res)=>{
    try {
        if(req.session.otp == req.body.otp_verify){
            const tempUser = req.session.tempSaveUser
            const user = new User(tempUser)
            console.log(user);
            const result = await user.save()
            console.log(result);
            if(result){
                await User.findOneAndUpdate({_id:result._id},{isVerified:true})
                req.session.otp = null
                req.session.tempSaveUser = null
                res.status(200).json({message:'Otp verified'})
            }
        }else{
            console.log('otp is not verifying');
            res.status(404).json({error:'*OTP is expired/not valid'})
        }
    } catch (error) {
        if(error){
            console.log('error found while verifying otp',error);
        }
    }
}

module.exports= {
    viewUserLogin,
    userLogin,
    viewUserSignup,
    signup,
    viewOtpVarify,
    otpVerification,
    viewHomePage,
}