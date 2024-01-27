const express=require("express");
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://akashkr099:0lYcEy0tM6eCailJ@chat-app-db.77rk4qs.mongodb.net/?retryWrites=true&w=majority");
const login=require('./Routes/loginRouter');
const signUp=require('./Routes/signupRouter');
const cors=require('cors');
const socket=require('socket.io');
const messageRouter = require("./Routes/messageRouter");
const app=express();
require('dotenv').config();
const port=process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use('/user/signup',signUp);
app.use('/user/login',login);
app.use('/message',messageRouter);

const server=app.listen(port,()=>{
    console.log("Server is listening on 4000");
})
const io = socket(server, {
    cors: {
      origin: "https://chatapp-s5nx.onrender.com",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.message);
      }
    });
  });