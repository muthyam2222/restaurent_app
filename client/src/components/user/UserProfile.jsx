import React from 'react'
import { useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom';


function UserProfile() {
  const {signOut}=useClerk();
  const navigate=useNavigate();
  const {user}=useClerk();
  const role=user?.publicMetadata?.role;
  async function handleSignout(){
    await signOut();
    navigate('/');
  }
  return (
    <div className='container mt-5 d-flex justify-content-center mx-auto'>
      <div className="card shadow-lg border-0" style={{maxWidth:"500px",width:"100%"}}>
        <div className="card-header bg-dark text-white text-center">
          <h4 className="mb-0">User Profile</h4>
        </div>
        <div className="card-body text-center">
          <img src={user?.imageUrl} className='rounded-circle mb-3 border border-3 border-primary' style={{width:"100px",height:"100px",objectFit:"cover"}} alt="User" />
          <h3 className='card-title'>{user?.firstName}</h3>
          <h6><span className='fw-bold'>User Name: </span>{user?.fullName}</h6>
          <p><span className='fw-bold'>Email: </span>{user?.emailAddresses[0].emailAddress}</p>
          {
            !role && <button className="btn btn-outline-dark border-0" onClick={()=>navigate('/orderpage')}>View Orders</button>
          }
          <div className="text-end">
            <button className="btn btn-outline-warning m-3" onClick={handleSignout}>LogOut</button>
          </div>
          <div className="card-footer text-center bg-light">
            <p className="text-muted my-auto">Signed in with Clerk</p>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default UserProfile