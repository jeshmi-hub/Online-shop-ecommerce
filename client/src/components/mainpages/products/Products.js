import React, {useContext,  useState} from 'react'
import ProductItem from '../../utils/productItem/ProductItem'
import { GlobalState } from '../../../GlobalState'
import Loading from '../../utils/loading/Loading'
import axios from 'axios'
import Filters from './Filters'
import LoadMore from './LoadMore'


function Products() {
  const state = useContext(GlobalState)
  const [products, setProducts] = state.productAPI.products
  const [isAdmin] = state.userAPI.isAdmin
  const [token] = state.token
  const [callback, setCallback] = state.productAPI.callback
  const [loading, setLoading] = useState(false)
  const [isCheck, setIsCheck] = useState(false)

  const handleCheck = (id)=>{
    products.forEach(product=>{
      if(product._id===id) product.checked = !product.checked
    })
    setProducts([...products])
  }

  const deleteProduct = async(id, public_id)=>{
    console.log({id, public_id})

    try{
      setLoading(true)
      const destroyImg = axios.post('http://localhost:8000/api/destroy',{public_id},{
        headers: {Authorization: token}
      })

      const deleteProduct =axios.delete(`http://localhost:8000/api/deleteProduct/${id}`,{
        headers: {Authorization: token}
      })

      await destroyImg
      await deleteProduct
      setCallback(!callback)
      setLoading(false)
    }catch(err){
      alert(err.response.data.msg)
    }
  }

  const checkAll = ()=>{
    products.forEach(product=>{
      product.checked = !isCheck
    })

    setProducts([...products])
    setIsCheck(!isCheck)
  }

  const deleteAll= ()=>{
    products.forEach(product=>{
      if(product.checked) deleteProduct(product._id, product.image.public_id)
    })

  }

  if(loading) return <div><Loading/></div>

  return (
    <>
    <Filters/>
     {
      isAdmin &&
      <div className='delete-all'>
        <span>Select all</span>
        <input type='checkbox' checked={isCheck} onChange={checkAll}/>
        <button onClick={deleteAll}>Delete all</button>
      </div>
    }
    <div className="products">
      {
        products.map(product=>{
          return <ProductItem key={product._id} product={product}  isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck} />
          
        })
      }
    </div>
    <LoadMore/>
    {products.length === 0  && <Loading />}
   
    </>

  )
}

export default Products


