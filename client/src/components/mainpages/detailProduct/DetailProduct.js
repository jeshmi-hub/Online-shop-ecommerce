import React, {useContext, useState, useEffect} from "react";
import {Link, useParams} from 'react-router-dom';
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../../utils/productItem/ProductItem";

function DetailProduct(){

    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productAPI.products
    const addToCart = state.userAPI.addToCart
    const [detailProduct, setDetailProduct] = useState([])

    useEffect(()=>{
        if(params){
            products.forEach(product=>{
                if(product._id === params.id)  setDetailProduct(product)
            })
        }
    },[params, products])
    console.log(detailProduct)
    if(detailProduct.length ===0) return null;
    return(
        <>
        <div className="detail">
      <img src={detailProduct.image.url} alt=""/>
      <div className="box-detail">
        <div className="row">
          <h2>{detailProduct.title}</h2>
          <h6>#id: {detailProduct.product_id}</h6>
          </div>
          <span> ${detailProduct.price}</span>
          <h3>{detailProduct.desc}</h3>
        <p>Sold: {detailProduct.sold}</p>

        <Link to="/cart" className="cart" onClick={()=> addToCart(detailProduct)}>Add To Cart</Link>
      </div>
    </div>

    <div>
     <h2>Other Products</h2>
     <div className="products">
      {
        products.map(product=>{
          return product.category === detailProduct.category 
          ? <ProductItem key={product._id} product={product}/> : null
          
        })
      }
     </div>
    </div>
        </>
    )
}

export default DetailProduct