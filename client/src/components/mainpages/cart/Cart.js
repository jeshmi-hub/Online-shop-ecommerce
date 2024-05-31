import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';

function Cart() {
    const state = useContext(GlobalState);
    const [cart, setCart] = state.userAPI.cart;
    const [id, setId] = state.userAPI.id;
    const [token] = state.token;
    const [total, setTotal] = useState(0);
    const [username, setUsername] = state.userAPI.username
    const [email, setEmail] = state.userAPI.email

    

    useEffect(() => {
        const getTotal = () => {
            const total = cart.reduce((prev, pro) => {
                return prev + (pro.price * pro.sold);
            }, 0);

            setTotal(total);
        };
        getTotal();
    }, [cart]);

    console.log(total)

    const addToCart = async (cart) => {
        await axios.patch('http://localhost:8000/api/cart', { cart }, {
            headers: { Authorization: token }
        });
    };

    const increment = (id) => {
        const updatedCart = cart.map(pro => {
            if (pro._id === id) {
                return { ...pro, sold: pro.sold + 1 };
            }
            return pro;
        });
        setCart(updatedCart);
    };
    
    const decrement = (id) => {
        const updatedCart = cart.map(pro => {
            if (pro._id === id && pro.sold > 1) {
                return { ...pro, sold: pro.sold - 1 };
            }
            return pro;
        });
        setCart(updatedCart);
    };

    const removeFromCart = (id) => {
        if (window.confirm("Do you want to delete product from the cart?")) {
            const updatedCart = cart.filter(pro => pro._id !== id);
            setCart(updatedCart);
            addToCart(updatedCart); // Assuming addToCart function also updates the cart on the server
        }
    };
    

    if (cart.length === 0) {
        return <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Cart Empty</h2>;
    }

    const handlePurchase = async()=>{
        try{
            const response = await axios.get(`http://localhost:8000/api/userCart/${id}/cart`,{
                headers: {Authorization: token}
            })
            console.log(response.data)
            const playload = {
                "return_url": "http://localhost:3000/sucess",
                "website_url": "http://localhost:3000",
                "amount": parseInt(total)*100,
                "purchase_order_id": response.data[0].product_id,
                "purchase_order_name": "test",
                "customer_info": {
                    "name": username,
                    "email": email,
                    "phone": "9800000123"
                }
              }

               const checkout = await axios.post(
      `http://localhost:8000/khalti-api`,playload
    );
    console.log(checkout);

    

    if (response) {
      window.location.href = `${checkout?.data?.data?.payment_url}`;
    }
            

        }catch(err){

        }
        

    }

    return (
        <div>
            {
                cart.map(product => (
                    <div className="detail cart" key={product._id}>
                         {product.image && product.image.url && (
                <img src={product.image.url} alt="" />
            )}
                        <div className="box-detail">
                            <h2>{product.title}</h2>
                            <h3> ${product.price * product.sold}</h3>
                            <p>{product.desc}</p>
                            <p>Sold: {product.sold}</p>
                            <div className='amount'>
                                <button onClick={() => decrement(product._id)}> - </button>
                                <span>{product.sold}</span>
                                <button onClick={() => increment(product._id)}> + </button>
                            </div>

                            <div className='delete' onClick={() => removeFromCart(product._id)}>X</div>
                        </div>
                    </div>
                ))
            }

            <div className='total'>
                <h3>Total: ${total}</h3>
                <button id='payment-button' onClick={handlePurchase}>
                 Khalti checkout
                 </button>
            </div>
        </div>
    );
}

export default Cart;
