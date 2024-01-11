const express=require("express");
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/chat-app");
const login=require('./Routes/loginRouter');
const signUp=require('./Routes/signupRouter');
const cors=require('cors');
const app=express();

app.use(express.json());
app.use(cors());
app.use('/user/signup',signUp);
app.use('/user/login',login);

app.listen(4000,()=>{
    console.log("Server is listening on 4000");
})