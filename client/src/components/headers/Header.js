import React, { useContext} from 'react'
import { Link } from 'react-router-dom'

import axios from 'axios'

function Header() {

  return (
      <header>
        <div className="menu">
        <i class="fa-solid fa-bars"></i> 
        </div>

        <div className="logo">
            <h1>
                <Link to="/">Admin</Link>
            </h1>
        </div>

        <ul>
            <li><Link to="/">Products</Link></li>
            <li><Link to="/create_doctor">Recipes</Link></li>
           <li><Link to="/category">Categories</Link></li>
        
             <li><Link to="/login">Login ✥ Register</Link>
                </li>
            <li className="menu">
            <i class="fa-sharp fa-solid fa-xmark"></i>
            </li>
        </ul>

            <div className="cart-icon">
            <span>1</span>
            <Link to=""><i class="fa-solid fa-cart-shopping"></i></Link>
            </div>
        
        

      </header>
  )
}

export default Header
