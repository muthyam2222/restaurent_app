import React from 'react'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

function PostItem() {

  const {register,handleSubmit,formState:{errors}}=useForm();
  const navigate=useNavigate();
  const {user}=useClerk();
  const email=user?.emailAddresses[0].emailAddress;
  async function postItem(itemobj){
    try{
      itemobj.isAvailable=true;
      console.log("Sending to backend:", itemobj);
      let res=await axios.post('https://restaurent-app-seven.vercel.app/menu-api/item',itemobj,{
        headers:{role:"admin"}
      });
      if(res.status===201 || res.status===200){
        navigate(`/adminprofile/${email}`);
      }
    }catch(err){
      if(err.response && err.response.status===400){
        alert(err.response.data.message);
      }else{
        alert('something went wrong');
      }
    }

  }
  return (
    <div>
      <form onSubmit={handleSubmit(postItem)} className="w-50 m-auto mt-5">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Item name</label>
          <input type="text" id="name" {...register('name')} className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input type="number" id="price" {...register('price')} className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" id="description" {...register('description')} className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input type="text" id="category" {...register('category')} className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">Image</label>
          <input type="text" id="imageUrl" {...register('imageUrl')} className="form-control" />
        </div>
        <button type="submit" className="btn btn-warning">Post Item</button>
      </form>
    </div>
  )
}

export default PostItem