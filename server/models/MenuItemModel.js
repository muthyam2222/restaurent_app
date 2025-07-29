const mongoose=require('mongoose');

const MenuItemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:false
    }
},{strict:"throw"})

const MenuItemModel=mongoose.model("MenuItem",MenuItemSchema);

module.exports=MenuItemModel;