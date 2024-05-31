import React, {useState, useEffect} from 'react'
import axios from 'axios'

const intialState = {
    username: '',
    email: ''
}

function UserAPI(token) {
    const[isLogged, setIsLogged] = useState(false)
    const[isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [id, setID] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    
   

    useEffect(() =>{
        if(token){
            const getUser = async() =>{
                try{
                    const res = await axios.get('http://localhost:8000/api/getUser', {
                        headers: {Authorization: token}
                    })
                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true): setIsAdmin(false)
                    setCart(res.data.cart)
                    setID(res.data._id)
                    setUsername(res.data.username)
                    setEmail(res.data.email)
                }catch(err){
                    alert(err.res.data.msg)
                }
            }

            getUser()
        }
    },[token])

    const addToCart = async(product)=>{
        if(!isLogged) return alert("Please login to continue purchasing the product")
        const check = cart.every(pro =>{
        return pro._id !== product._id
    })

    if(check){
        setCart([...cart, {...product, sold: 1}])
        await axios.patch('http://localhost:8000/api/cart', {cart: [...cart, {...product, sold:1}]},{
            headers: {Authorization: token}
        })
    }else{
        alert("The product has been added to your cart")
    }
    }

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addToCart: addToCart,
    id: [id, setID],
    username: [username, setUsername],
    email: [email, setEmail]
}
}

export default UserAPI
