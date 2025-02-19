import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';

function BtnRender({product, deleteProduct}){
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    

    return(
        
    <div className='row_btn'>
    {
      isAdmin ? 
      <>
      <Link id='btn_add' to="#!" onClick={()=>deleteProduct(product._id, product.image.public_id)}>
      Delete
    </Link>
    <Link id='btn_view' to={`/edit_product/${product._id}`}>
      Edit
    </Link>
    </>
     :
     <>
      <Link id='btn_product' to={`/detail/${product._id}`}>
      Add to Cart
    </Link>
    <Link id='btn_view' to={`/detail/${product._id}`}>
      View Product
    </Link>
     </>
    }
   
  </div>
        
    )
}

export default BtnRender