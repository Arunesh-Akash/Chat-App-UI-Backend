const mongoose=require('mongoose');

const imageSchema=mongoose.Schema(
    
    {
        image:String,
        email:String
    },
    {
        timestamps: true
    },
    
)
const Image=mongoose.model('images',imageSchema,'images');
module.exports=Image;