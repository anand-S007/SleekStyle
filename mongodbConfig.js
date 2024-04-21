const mongoose = require('mongoose')

const connectMoongoose = async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/sleekStyleDB');
        mongoose.connection.on('connected',()=>{
        console.log('mongodb connected');
        })
        mongoose.connection.on('error',(error)=>{
        console.log(error,'Error while connecting mongodb')
        })
        mongoose.connection.on('disconnected',()=>{
        console.log('mongodb connection disconnected');
        })
    } catch (error) {
        console.log('Error found in mongodb cofig settings',error);
    }
}



module.exports = {connectMoongoose,mongoose}