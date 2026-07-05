import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

function MenuPage() {
    const [items,setItems]=useState([]);
    const navigate=useNavigate();
    const {user}=useClerk();
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
      name: '',
      imageUrl:'',
      description: '',
      price: '',
      category: ''
    });

    function handleEditClick(item){
      setEditItem(item)
      setFormData({
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
        imageUrl:item.imageUrl
      })
      const modal = new window.bootstrap.Modal(document.getElementById('editModal'));
      modal.show();
    }

    async function handleSave(){
      try{
        await axios.put(`https://restaurent-app-seven.vercel.app/menu-api/item/${editItem.name}`,formData,{
          headers:{role:"admin"}
        })
        document.getElementById('closeModalBtn').click(); 
          getItems();

      }
      catch(err){
        console.error("Error in Updating items ",err)
      }
    }

    async function handleDelete(item){
      try{
        
        await axios.put(`https://restaurent-app-seven.vercel.app/menu-api/items/${item.name}`,{isAvailable:false},{
          headers:{role:"admin"}
        })
        getItems();
      }catch(err){
        console.error("Error in Updating items ",err)
      }
    }

    async function handleRestore(item){
      try{
        // item.isAvailable=true
        await axios.put(`https://restaurent-app-seven.vercel.app/menu-api/items/${item.name}`,{isAvailable:true},{
          headers:{role:"admin"}
        })
        getItems();
      }catch(err){
        console.error("Error in Updating items ",err)
      }
    }

    async function getItems(){
        try{
            let res=await axios.get("https://restaurent-app-seven.vercel.app/menu-api/items")
            if(res.data.message==="Menu items fetched successfully"){
              setItems(res.data.payload);
            }
            console.log(items)
        }catch(err){
            console.error("Error fetching menu items",err);
        }
    }


    useEffect(()=>{
        getItems();
    },[])
  return (
    <div className="my-2 container">
      <div className=" row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {
          items.map((item,index)=>{
            return (
              <div className='col' key={index}>
                <div className="card card-hover card-shadow h-100 rounded-4">
                  <img src={item.imageUrl} className='rounded-4' alt="" style={{height:"200px",objectFit:"cover"}} />
                  <div className="card-body">
                    <div className="text-center">
                      <h3 className="text-bold">{item.name}</h3>
                      <p className="lead">{item.category}</p>
                    </div>
                    <p className="card-text">{item.description}</p>
                    <div className="d-flex justify-content-between">
                      <h4 className="card-text text-danger">₹{item.price}</h4>
                      <div className="text-end">
                        <button className="btn btn-outline-primary me-2 border-0" onClick={()=>handleEditClick(item)}>Edit</button>
                        {
                          item.isAvailable===true ? <button className="btn btn-outline-danger border-0" onClick={()=>handleDelete(item)}>Delete</button>
                          : <button className="btn btn-outline-danger border-0" onClick={()=>handleRestore(item)}>Restore</button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">Edit Menu Item</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalBtn"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={formData.name} disabled onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input type="number" className="form-control" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input type="text" className="form-control" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuPage