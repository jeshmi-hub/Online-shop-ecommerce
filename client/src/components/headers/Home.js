import React, { useEffect, useState } from 'react'
import Loading from '../utils/loading/Loading'
import BtnRender from '../utils/productItem/BtnRender'
import axios from 'axios'

function Home() {
    const [loading, setLoading] = useState(false)
    const[products, setProduct] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Set loading state to true before making the request
                const response = await axios.get('http://localhost:8000/api/product?title=Buff');
                setProduct(response.data.product);
                setLoading(false); // Set loading state to false after receiving the response
                console.log(response.data.product);
            } catch (err) {
                setLoading(false); // Set loading state to false in case of an error
                alert(err.response.data.msg);
            }
        };
    
        fetchData();
    }, []);
    if(loading) return <div><Loading/></div>
  return (
    <>
    <div className='products'>
      {
        products.map(product=>{
            return (
                <>
                <div className='product_card'>
                <img src={product.image.url} alt=""/>
<               div className="product_box">
                <h2 title={product.title}>{product.title}</h2>
                <h3>{product.desc}</h3>
                <span>${product.price}</span>
                <h6>{product.sold}</h6>
                 </div>
                 <BtnRender product={product}/>
                </div>
                </>
            )
        })
      }
    </div>
    </>
  )
}

export default Home
