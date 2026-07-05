import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import {RouterProvider,createBrowserRouter}  from 'react-router-dom';
import RootLayout from './components/RootLayout.jsx';
import Home from './components/common/Home.jsx';
import Signin from './components/common/Signin.jsx';
import Signup from './components/common/Signup.jsx';
import PostItem from './components/admin/PostItem.jsx'
import AdminProfile from './components/admin/AdminProfile.jsx'
import MenuPage from './components/admin/MenuPage.jsx'
import UserProfile from './components/user/UserProfile.jsx';
import Cart from './components/user/Cart.jsx';
import OrderPage from './components/user/OrderPage.jsx';
import CartContext from './contexts/CartContext.jsx'
// import EditItem from './components/admin/EditItem.jsx'
// import PostItem from './components/admin/PostItem.jsx'

// hello
const browserRouterObj=createBrowserRouter([
  {
    path:"/",
    element:<RootLayout />,
    children:[
      {
        path:"",
        element:<Home />
      },
      {
        path:"signin",
        element:<Signin />
      },
      {
        path:"signup",
        element:<Signup />
      },
      {
        path:"adminprofile/:email",
        element:<AdminProfile />,
        children:[
          {
            path:"",
            element:<MenuPage/>
          },
          {
            path:"postitem",
            element:<PostItem />
          }
        ]
      },
      {
        path:"userprofile/:email",
        element:<UserProfile />
      },
      {
        path:"cart",
        element:<Cart/>
      },
      {
        path:"orderpage",
        element:<OrderPage />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  
    <StrictMode>
      <CartContext>
      {/* <App /> */}
      <RouterProvider router={browserRouterObj} />
      </CartContext>
      </StrictMode>
  
)
