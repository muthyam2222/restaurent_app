const mongoose=require('mongoose');

const itemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
},{"Strict":"throw"})

const OrderSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    orderId:{
        type:String,
        required:true,
        unique:true
    },
    items:[itemSchema],
    price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","delivered","cancelled"]
    }
},{Strict:"throw",timestamps:true})

const OrderModel=mongoose.model("Order",OrderSchema);

module.exports=OrderModel;