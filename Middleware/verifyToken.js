const jwt=require('jsonwebtoken');
const AppUtils=require('../AppUtils');

function verifyToken(req,res,next){
    let token=req.headers['authorization'];
    if(token){
        token=token.split(' ')[1];
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,success)=>{
            if(err){
                res.status(400).json(AppUtils.generateError('UNAUTHORISED','Token is not valid'));
            }
            else{
                next();
                
            }
        })
    }
    else{
        res.status(403).json(AppUtils.generateError('TOKEN MISSING','Token is missing'));
    }
  }
 module.exports=verifyToken;