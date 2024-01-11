const express=require('express');
const signUp=express();
const User=require('../Schema/userSchema');
const AppUtils=require('../AppUtils');
const Constants=require('../Constants');


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
        res.status(200).json(AppUtils.generateSuccess("REGISTERED SUCCESSFULLY","User added"));
    }
    catch(err){
        if(err.code=="11000"){
            res.status(400).json(AppUtils.generateError("USER ALREADY EXISTS","User already exists"));
            return;
        }
        res.status(500).json(AppUtils.generateError(err.code,err.message));
    }
});



module.exports=signUp;