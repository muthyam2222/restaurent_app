import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { useClerk ,useUser} from '@clerk/clerk-react';

function OrderPage() {
  const [orders,setOrders]=useState([]);
  const {user}=useUser()

  async function getOrders(){
    try{
      const res=await axios.get(`http://localhost:3000/order-api/orders/${user.id}`)
      if(res.data.message==='Orders fetched successfully'){
        setOrders(res.data.payload)
      }
    }catch(err){
      alert("something went wrong while fetching orders")
    }
  }


  useEffect(()=>{
    if(user){
      getOrders();
    }
  },[user]);

  return (
    <div className="container my-5 pb-5">
      <h2 className="text-xl font-bold mb-4 text-center">Your Orders</h2>
      {orders.length === 0 ? (
        <p className='text-danger fs-1 mt-4 text-center'>No orders found.</p>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div key={order.orderId} className="col-md-8 mx-auto">
              <div className="card card-hover order-card h-100 shadow">
                <div className="card-body">
                  <h5 className="card-title">Order ID: {order.orderId}</h5>
                  <p className="card-text">
                    <strong>Status:</strong>{' '}
                    <span className="">
                      {order.status}
                    </span>
                  </p>
                  <p className="card-text">
                    <strong>Total Price:</strong> ₹{order.price}
                  </p>
                  <p className="card-text mb-1"><strong>Items:</strong></p>
                  <ul className="ps-3 mb-0">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderPage