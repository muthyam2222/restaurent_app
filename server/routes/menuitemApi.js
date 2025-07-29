const exp=require('express');
const menuApp=exp.Router();
const MenuItemModel=require('../models/MenuItemModel');
const expressAsyncHandler=require('express-async-handler');
// const {requireAuth}=require('@clerk/express')

// ✅ checkAdmin middleware defined here itself
function checkAdmin(req, res, next) {
  const role = req.headers['role']; // Or however you’re passing the user role

  if (role !== 'admin') {
    return res.status(403).send({ message: 'Access denied. Admins only.' });
  }

  next();
}

menuApp.get('/items',expressAsyncHandler(async(req,res)=>{
    const menuitems=await MenuItemModel.find();;
    res.status(200).send({message:"Menu items fetched successfully",payload:menuitems});
}))


// menuApp.get('/unauthorized',(req,res)=>{
//     res.send({message:"Unauthorized request"})
// })


menuApp.post('/item',checkAdmin,expressAsyncHandler(async(req,res)=>{
    const newItemObj=req.body;
    const existeditem=await MenuItemModel.findOne({name:newItemObj.name});
    if(existeditem){
        if(existeditem.isAvailable){
            return res.status(400).send({message:"Menu item already exists"});
        }else{
            existeditem.set({...newItemObj,isAvailable:true});
            const updatedItem=await existeditem.save();
            return res.status(200).send({message:"Menu item updated successfully",payload:updatedItem});
        }
    }
    const newItem=new MenuItemModel(newItemObj);
    const newMenuItem=await newItem.save();
    res.status(201).send({message:"New menu item added successfully",payload:newMenuItem});
}))

menuApp.put('/item/:name',checkAdmin,expressAsyncHandler(async(req,res)=>{
    const menuitem=req.body;
    const item=await MenuItemModel.findOneAndUpdate({name:req.params.name},{...menuitem},{new:true});
    res.status(200).send({message:"Menu item updated successfully",payload:item});
}))

menuApp.put('/items/:name',checkAdmin,expressAsyncHandler(async(req,res)=>{
    const menuitem=req.body;
    const item=await MenuItemModel.findOneAndUpdate({name:req.params.name},{isAvailable:menuitem.isAvailable},{new:true});
    res.status(200).send({message:"Menu item deleted successfully"});
}))


module.exports=menuApp;