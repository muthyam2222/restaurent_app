import {React,useState,useEffect, useContext} from 'react'
import { useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { cartContextObj } from '../../contexts/CartContext';




function Home() {
  const {cart,addToCart,removeCart}=useContext(cartContextObj);
  const {isSignedIn,user,isLoaded}=useClerk();
  const [items,setItems]=useState([]);
  const [error,setError]=useState('');
  //  console.log(user)
  // const [count,setCount]=useState({});
  const role=user?.publicMetadata.role;
  const navigate=useNavigate();
  const email=user?.emailAddresses[0].emailAddress;
  async function getItems(){
    let res=await axios.get('http://localhost:3000/menu-api/items')
    if(res.data.message==="Menu items fetched successfully"){
      const isAdmin = user && user.publicMetadata.role === "admin";
      const filteredItems = isAdmin
        ? res.data.payload
        : res.data.payload.filter(item => item.isAvailable);

      setItems(filteredItems);
    }else{
      setError("Failed to fetch memu items");
    }
  }



  useEffect(()=>{
    if(isSignedIn){
      if(role==="admin"){
        navigate(`/adminprofile/${email}`)
      }else{
        getItems();
      }
    }
  },[isSignedIn,role])

  return (
    <div>
      {
        !isSignedIn?<>
          <div className='fullscreen-hero'>
            <div className='hero-overlay'>
              <h1 className="display-4 fw-bold">Welcome to <span style={{color:"#fb460aff"}}>Spice Heaven</span></h1>
              <p className="lead mt-3">Delicious meals, fresh ingredients, and quick delivery.</p>
              <p className="fs-5">Please sign in to explore our menu and place your order!</p>
            </div>
          </div>
        </>:<>
          <div className="container my-5">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
              {
                items.map((item,index)=>{
                  const itemCount = cart[item._id]?.quantity || 0;
                  return (
                    <div className='col' key={index}>
                      <div className="card card-hover h-100 d-flex flex-column rounded-4 card-shadow">
                        <img src={item.imageUrl} className='rounded-4' alt="" style={{height:"200px",objectFit:"cover"}} />
                        <div className="card-body d-flex flex-column">
                          <div className="text-center">
                            <h3 className="text-bold">{item.name}</h3>
                            <p className="lead">{item.category}</p>
                          </div>
                          <p className="card-text">{item.description}</p>
                          <h4 className="card-text text-danger">₹{item.price}</h4>
                          <div className="mt-auto">
                            {
                              itemCount === 0 ? (
                                <button className='btn btn-warning' onClick={() => addToCart(item)}>
                                  Add To Cart
                                </button>
                              ) : (
                                <div className="d-flex align-items-center gap-2">
                                  <button className="btn btn-success" onClick={() => removeCart(item._id)}>-</button>
                                  <span>{itemCount}</span>
                                  <button className="btn btn-success" onClick={() => addToCart(item)}>+</button>
                                </div>
                              )
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default Home