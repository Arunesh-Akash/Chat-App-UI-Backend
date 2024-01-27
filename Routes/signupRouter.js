const express=require('express');
const signUp=express();
const User=require('../Schema/userSchema');
const Image=require('../Schema/imageSchema');
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
        if(err.code=="11000"){
            res.status(400).json(AppUtils.generateError("USER ALREADY EXISTS","User already exists"));
            return;
        }
        res.status(500).json(AppUtils.generateError(err.code,err.message));
    }
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'ProfileImage/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


signUp.post('/upload-image',upload.single('image'),async (req, res) => {
    try {
        const userEmail = req.query.email;

        if (!req.file) {
            res.status(400).json(AppUtils.generateError('IMAGE NOT FOUND', 'Image name is error'));
            return;
        }

        const imageName = req.file.filename;

        await Image.create({ email: userEmail, image: imageName});

        res.status(200).json({ message: 'Uploaded successfully'});
    } catch (err) {
        res.status(500).json(AppUtils.generateError(err.code, err.message));
    }
});


signUp.get('/get-image',async (req, res) => {
    try {
        const userEmail = req.query.email;
        const imageData = await Image.findOne({ email: userEmail });

        if (!imageData) {
            res.status(404).json({ error: 'Image not found for the given email' });
            return;
        }

        const imagePath = path.join(__dirname,'..','ProfileImage', imageData.image);
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Error reading the image file', details: err.message });
                return;
            }

            res.setHeader('Content-Type', 'image/jpeg');
            res.end(data);
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

signUp.use(express.static(path.join(__dirname,'..' ,'ProfileImage')));


module.exports=signUp;