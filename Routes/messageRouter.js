const express=require('express');
const messageRouter=express();
const Message=require('../Schema/messageSchema');
const AppUtils = require('../AppUtils');
const verifyToken=require('../Middleware/verifyToken')

messageRouter.post('/addmsg',verifyToken,async(req,res)=>{
    try{
        const {to,from,message}=req.body;
        
        const data=await Message.create({
            message:message,
            users:[to,from],
            sender:from
        })
        if(data){
            res.status(200).json({msg:"Message send Successfully"});
        }
        else{
            res.status(400).json({msg:"Failed to Send the message"})
        }

    }
    catch(err){
        res.status(500).json(AppUtils.generateError(err.code,err.message));
    }

});

messageRouter.post('/getMsg',verifyToken,async(req,res)=>{
    try {
        const { to, from } = req.body;
    
        const messages = await Message.find({
          users: {
            $all: [to,from],
          },
        }).sort({ updatedAt: 1 });
    
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message,
          };
        });
        res.json(projectedMessages);
      } catch (err) {
        res.status(500).json(AppUtils.generateError(err.code,err.message));
      }
})


module.exports=messageRouter;