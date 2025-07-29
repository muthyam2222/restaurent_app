import React from 'react'
import { Outlet,NavLink } from 'react-router-dom'

function AdminProfile() {
  return (
    <div className='admin-profile my-5'>
      <ul className="d-flex justify-content-around fs-3 list-unstyled">
        <li className="nav-item">
          <NavLink className="nav-link" to="">Menu Items</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="postitem">Post New Item</NavLink>
        </li>
      </ul>
      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminProfile