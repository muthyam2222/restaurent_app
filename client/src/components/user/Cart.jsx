import React, { useContext,useState } from 'react'
import { cartContextObj } from '../../contexts/CartContext'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const {cart,addToCart,removeCart,getTotalAmount,clearCart}=useContext(cartContextObj);
  const [showModal, setShowModal] = useState(false);
  const items=Object.values(cart);
  const {user}=useClerk();
  const navigate=useNavigate();
  // console.log(user)

  function handleProceedToPay() {
    setShowModal(true);
  }

  async function handleFakePayment() {
    try {
      // 👇 Prepare items to match OrderModel schema
      const orderItems = items.map(item => ({
        name: item.name,
        quantity: item.quantity
      }));
      console.log(user)

      const orderPayload = {
        userId: user.id, // Replace with real userId if using Clerk
        orderId: uuidv4(), // Generate unique ID
        items: orderItems,
        price: getTotalAmount(),
        status: "pending"
      };

      await axios.post("http://localhost:3000/order-api/order", orderPayload);

      alert("✅ Payment successful and order placed!");
      setShowModal(false);
      navigate('/orderpage');
      clearCart();
    } catch (err) {
      console.error("❌ Error placing order:", err);
      alert("Something went wrong while placing the order.");
    }
  }

  return (
    <div className='container my-5 w-50'>
      <h3 className="text-dark text-center">Your Cart</h3>
      {
        items.length===0 ? <h5 className="text-danger m-5 text-center fs-1">Your Cart is Empty</h5> : <>
          <ul className="list-group">
            {items.map(item=>(
              <li className="d-flex justify-content-between mb-4 card-hover" key={item._id}>
                <div className="">
                  <h6 className="mb-1">{item.name}</h6>
                  <img src={item.imageUrl} className='rounded-4' alt="" style={{height:"60px",width:"60px",borderRadius:"8px",marginRight:"12px",objectFit:"cover"}} />
                  <small className="text-muted">
                    {item.quantity} x ₹{item.price}
                  </small>
                  
                </div>
                
                <div>
                  <span className="fw-bold">₹{item.price*item.quantity}</span>
                  
                  <div className="d-flex border border-2 border-dark rounded-2">
                    <button className="btn m-1 btn-outline-success border-0" onClick={()=>removeCart(item._id)}>-</button>
                    <p className='pt-3'>{item.quantity}</p>
                    <button className="btn m-1 btn-outline-info border-0" onClick={()=>addToCart(item)}>+</button>
                  </div>
                </div>
                
                
              </li>
            ))}
          </ul>
          <div className="mt-4 d-flex justify-content-between align-items-center border-top pt-3">
            <h4>Total</h4>
            <h4>₹{getTotalAmount()}</h4>
          </div>
          <div className="mt-3 text-center">
            <button className="btn btn-primary px-4" onClick={handleProceedToPay}>Proceed To Pay</button>
          </div>
        </>

      }


      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Simulated Payment</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Total: ₹{getTotalAmount()}</p>
                <p>This is a simulated payment for practice purposes.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={handleFakePayment}>Confirm Payment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart