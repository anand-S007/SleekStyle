const mongoose = require('mongoose')
require('dotenv').config()

const connectMongodb = async()=>{
    try {
        console.log('entry');
        mongoose.connect(process.env.MONGODB_URI);
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
 
 

module.exports = connectMongodb