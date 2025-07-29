const exp=require('express');
const orderApp=exp.Router();
const OrderModel=require('../models/OrderModel');
const expressAsyncHandler=require('express-async-handler');
const cron=require('node-cron');

orderApp.post('/order',expressAsyncHandler(async(req,res)=>{
    try{
        const orderData=req.body;
        const newOrder=new OrderModel(orderData);
        const savedOrder=await newOrder.save();
        res.status(201).send({message:"Order placed successfully",payload:savedOrder});
    }catch (error) {
        console.error('Error saving order:', error);
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
}))

orderApp.get('/unauthorized',(req,res)=>{
    res.send({message:"Unauthorized request"})
})

orderApp.get('/orders/:userId',expressAsyncHandler(async(req,res)=>{
    const userId=req.params.userId;
    const order=await OrderModel.find({userId:userId});
    res.status(200).send({message:"Orders fetched successfully",payload:order});
}))

orderApp.put('/order/:orderId',expressAsyncHandler(async(req,res)=>{
    const orderId=req.params.orderId;
    const orderData=req.body;
    const updateOrder=await OrderModel.findOneAndUpdate({orderId:orderId},{...orderData},{new:true});
    res.status(200).send({message:"Order updated successfully",payload:updateOrder});
}))

cron.schedule('* * * * *', async () => {
  try {
    const now = Date.now();

    const acceptedResult = await OrderModel.updateMany(
      {
        status: 'pending',
        updatedAt: { $lte: new Date(now - 5 * 60000) }
      },
      {
        $set: { status: 'accepted' },
        $currentDate: { updatedAt: true }
      }
    );

    const deliveredResult = await OrderModel.updateMany(
      {
        status: 'accepted',
        updatedAt: { $lte: new Date(now - 10 * 60000) }
      },
      {
        $set: { status: 'delivered' },
        $currentDate: { updatedAt: true }
      }
    );

    // console.log(`Cron job ran: ${acceptedResult.modifiedCount} orders accepted, ${deliveredResult.modifiedCount} orders delivered`);

  } catch (error) {
    console.error('Error running cron job:', error);
  }
});



module.exports=orderApp;