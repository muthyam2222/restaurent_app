const exp=require('express');
const app=exp();
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config();
app.use(cors());

const port=process.env.PORT || 4000;

mongoose.connect(process.env.DBURL)
.then(()=>{
    console.log("DB connected successfully");
    app.listen(port,()=>{console.log(`server is running on port ${port}...`)})
})
.catch(err=>console.log("Error in DB connection",err))

app.use(exp.json());
app.use('/menu-api',require('./routes/menuitemApi'));
app.use('/order-api',require('./routes/orderApi'));
