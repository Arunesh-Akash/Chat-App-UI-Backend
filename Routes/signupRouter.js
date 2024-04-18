const express=require('express');
const signUp=express();
const User=require('../Schema/userSchema');
const AppUtils=require('../AppUtils');
const Constants=require('../Constants');
const jwt=require('jsonwebtoken');
const multer=require('multer');
const fs=require('fs');
const path=require('path');
const verifyToken = require('../Middleware/verifyToken');


signUp.post('/',async(req,res)=>{
    const user=req.body;
    if(AppUtils.checkError(user,Constants.USER)){
        res.status(500).json(AppUtils.checkError(user,Constants.USER));
    }
    try{
        user.password=await AppUtils.encryptPassword(user.password);
        user.email=user.email.toLowerCase();
        const newUser=new User(user);
        await newUser.save();
        jwt.sign({newUser},process.env.JWT_SECRET_KEY,{expiresIn:'1h'},(err,token)=>{
            if(err){
               return res.status(500).json(AppUtils.generateError('Something went wrong',err.message));
            }
            

            return res.status(200).json(AppUtils.generateSuccess({email:user.email,token:token}));
            
        });
    }
    catch(err){
        if(err.code==="11000"){
            res.status(400).json(AppUtils.generateError("USER ALREADY EXISTS","User already exists"));
            return;
        }
        res.status(500).json(AppUtils.generateError(err.code,err.message));
    }
});



module.exports=signUp;