const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    userName:String,
    email:{type:String,unique:true},
    password:String
},{timestamps:true});


const User=mongoose.model("users",userSchema,"users");
module.exports=User;