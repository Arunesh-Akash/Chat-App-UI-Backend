const express=require('express');
const session=require('express-session');
const login=express();
const User=require('../Schema/userSchema');
const AppUtils=require('../AppUtils');
const Constants=require('../Constants');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const verifyToken=require('../Middleware/verifyToken')


login.post('/',async(req,res)=>{
    const request={
        email:req.body.email,
        password:req.body.password
    }
    if(AppUtils.checkError(request,Constants.LOGIN_REQUEST)){
        res.status(500).json(AppUtils.checkError(request,Constants.LOGIN_REQUEST));
    }
    try {
        request.email=request.email.toLowerCase();
        let data =await User.findOne({email:request.email});
        if(data){
            let passwordMatch=await bcrypt.compare(request.password,data.password);
            if(passwordMatch){
               jwt.sign({data},process.env.JWT_SECRET_KEY,{expiresIn:'1h'},(err,token)=>{
                    if(err){
                    res.status(500).json(AppUtils.generateError('Something went wrong',err));
                    }
                    
                    res.status(200).json({status:"AUTHORISED",message: "Successfully Logged In",email:request.email,token:token,name:data.userName});
                    
                });
                
            }
            else{
                res.status(401).json(AppUtils.generateError("UNAUTHORISED","Invalid Credentials"));
            }
        }
        else{
            res.status(400).json(AppUtils.generateError('USER NOT FOUND',`No user found with ${request.email}`))
        }
    } catch (err) {
        res.status(500).json(AppUtils.generateError(err.code,err.message));
    }
});


login.get('/',verifyToken,async(req,res)=>{
    try{
        const userData= await User.find();
        res.status(200).json(userData);
    }
    catch(err){
        res.status(500).json(AppUtils.generateError(err.code,err.message));
    }
});

const users = new Map();

login.post('/onlineStatus', (req, res) => {
  const { user } = req.body;
  const isOnline = users.has(user) && users.get(user).isOnline;
  res.json({ isOnline });
});
  
module.exports=login;