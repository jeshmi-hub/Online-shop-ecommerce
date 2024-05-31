import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import {useParams} from 'react-router-dom';
import Loading from '../../utils/loading/Loading';

const intialState = {
    product_id: '',
    title: '',
    desc:'',
    price: 0,
    category: '',
    _id: ''

}

function CreateProduct(){
    const state = useContext(GlobalState)
    const [product, setProduct] = useState(intialState)
    const [categories] = state.categoriesAPI.categories
    const [images, setImages] = useState(false)
    const [loading, setLoading] =useState(false)

    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const param = useParams()

    const [products] = state.productAPI.products
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.productAPI.callback

    useEffect(()=>{
        if(param.id){
            setOnEdit(true)
            products.forEach(product=>{
                if(product._id ===param.id){
                    setProduct(product)
                    setImages(product.image)
                }
            })
        }else{
            setOnEdit(false)
            setProduct(intialState)
            setImages(false)
        }
    },[param.id, products])

    const handleUpload = async e =>{
        e.preventDefault()
        try{
            if(!isAdmin) return alert("You're not an admin")
            const file = e.target.files[0]
            if(!file) return alert("File does not exist.")

            if(file.size>1024*1024)
            return alert("Size too large!")

            if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp')
            return alert("File format is incorrect.")

            let formData = new FormData()
            formData.append('file', file)
            setLoading(true)
            const res = await axios.post('http://localhost:8000/api/upload', formData,{
                headers: {'Content-Type' : 'multipart/form-data', Authorization: token}
            })

            setLoading(false)
            setImages(res.data)
            console.log(res.data)

        }catch(err){
            alert(err.response.data.msg)

        }
    }
    

    const handleDestroy = async()=>{
        try{
            if(!isAdmin) return alert("You're not admin")
            setLoading(true)
            await axios.post('http://localhost:8000/api/destroy',{

                public_id: images.public_id
            },{
                headers: {Authorization: token}
            })
            setLoading(false)
            setImages(false)

        }catch(err){
            alert(err.response.data.msg)
        }
    }

    const handleChangeInput = e=>{
        const {name, value} = e.target
        setProduct({...product, [name]: value})
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        try{
            if(!isAdmin) return alert("You're not an admin")
            console.log(images)
            if(!images) return alert("No Image Uploaded")
            console.log(images)
            const{public_id, url} = images

            if(onEdit){
                await axios.put(`http://localhost:8000/api/updateProduct/${product._id}`, {...product,image:{public_id,url}},{
                    headers: {Authorization: token}
                })
            }else{
                await axios.post('http://localhost:8000/api/addProducts',{...product,image:{public_id,url}},{
                    headers: {Authorization: token}, withCredentials: true
                })
            }
            setImages(false)
            setProduct(intialState)
            setCallback(!callback)
            window.location.href = "/";
        }catch(err){
            if (err.response) {
                // The request was made and the server responded with a status code
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                alert(err.response.data.msg);
            } else if (err.request) {
                // The request was made but no response was received
                console.log(err.request);
                alert("No response from server");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
                alert("An error occurred");
            }
        

        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }
    return(
        <div className='create_product'>
            <div className='upload'>
                <input type='file' name='file' id='file_up' onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"><Loading/></div>:
                    <div id="file_img" style={styleUpload}>
                    <img src={images ? images.url: ''} alt=''/>
                    <span onClick={handleDestroy}>X</span>
                     </div>
                }
            </div>

            <form onSubmit={handleSubmit}>
                <div className='rows'>
                    <label htmlFor='product_id'>Product ID</label>
                    <input type="text" name="product_id" id="product_id" required value={product.product_id} onChange={handleChangeInput}/>
                </div>
                <div className='rows'>
                    <label htmlFor='title'>Title</label>
                    <input type='text' name='title' id='title' required value={product.title} onChange={handleChangeInput}/>
                </div>
                <div className='rows'>
                    <label htmlFor='desc'>Description</label>
                    <input type='text' name='desc' id='desc' required value={product.desc} onChange={handleChangeInput}/>
                </div>
                <div className='rows'>
                    <label htmlFor='price'>Price</label>
                    <input type='number' name='price' id='price' required value={product.price} onChange={handleChangeInput}/>
                </div>
                <div className='rows'>
                    <label htmlFor='categories'>Categories:</label>
                    <select name='category' value={product.category} onChange={handleChangeInput}>
                    <option value="">Please select a category</option>
                 {categories.map(category => (
                 <option value={category._id} key={category._id}>
                  {category.name}
                   </option>
                 ))}
                </select>

                </div>
            <button type='submit'>{onEdit? "Update" : "Create"}</button>
            </form>
        </div>
    )

}

export default CreateProduct