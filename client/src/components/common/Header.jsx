import React, { useEffect } from 'react'
import {Link,useNavigate,NavLink, useLocation} from 'react-router-dom'
import {useUser,useClerk} from '@clerk/clerk-react'
import logo2 from '../../assets/logo2.jpg'
import { FaShoppingCart } from "react-icons/fa";

function Header() {

  const {isSignedIn,user,isLoaded}=useUser();
  const {signOut} =useClerk();
  const navigate=useNavigate();
  const location=useLocation();
  const role=user?.publicMetadata.role;
  const email=user?.emailAddresses[0].emailAddress;
  // console.log("user:",user)

  async function handleSignout(){
    await signOut();
    navigate('/');
  }
  useEffect(()=>{
    if(isSignedIn && role!=='admin'){
      navigate('/');
    }
  },[isSignedIn,role,email])


  return (
    
      
        <div className="d-flex header justify-content-between align-items-center p-2 rounded-2 h-100">
          <Link to="" className="nav-link">
            <img src={logo2} style={{background:"transparent"}} className='ms-4 rounded' width="80px" height="60px" alt="" />
          </Link>
          <div className="d-flex justify-content-end align-items-center">
            <ul className="nav">
              
              {
                !isSignedIn?<>
                    <li className="nav-item">
                      <Link to="" className="nav-link text-white">Home</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="signin" className="nav-link text-white">Signin</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="signup" className="nav-link text-white">Signup</Link>
                    </li>
                </>:<>
                  <div className="d-flex justify-content-around align-items-center">
                    <NavLink to={`userprofile/${email}`} className='text-dark text-decoration-none mx-auto' >
                      <div style={{position:"relative"}}>
                        <img src={user.imageUrl} className='rounded-circle' width="40px" height="40px" alt="" />
                        <p className="lead fw-normal">{user.fullName}</p>
                      </div>
                    </NavLink>
                    {
                      isSignedIn && role!=='admin' && (
                        <div className="mx-3">
                          <NavLink to={'cart'}><FaShoppingCart style={{width:"50px",height:"30px",color:"white"}} /></NavLink>
                        </div>
                      )
                    }
                    {
                      location.pathname!==`/userprofile/${email}` && <button className="btn btn-warning ms-3" onClick={handleSignout}>SignOut</button>
                    }
                  </div>
                </>
              }
            </ul>
          </div>
        </div>
      
   
  )
}

export default Header