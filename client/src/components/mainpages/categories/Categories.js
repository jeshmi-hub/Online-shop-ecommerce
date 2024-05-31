import React,{useState, useContext} from 'react'
import {GlobalState} from '../../../GlobalState'

import axios from 'axios';


function Categories() {
  const state = useContext(GlobalState)
  const [categories] = state.categoriesAPI.categories
  const [category, setCategory] = useState('')
  const [token] = state.token
  const [callback, setCallback] = state.categoriesAPI.callback
  const [onEdit, setOnEdit] = useState(false)
  const [id, setID] = useState(false)

  const createCategory = async e=>{
    e.preventDefault()
    try{
      if(onEdit){
        const res = await axios.put(`http://localhost:8000/api/updateCategory/${id}`,{name: category},{
          headers: {Authorization: token}
        })

        alert(res.data.msg)
      }else{
        const res = await axios.post('http://localhost:8000/api/createCategory',{name:category},{
          headers: {Authorization:token}
        })
        alert(res.data.msg)
      }
      setOnEdit(false)
      setCategory('')
      setCallback(!callback)

    }catch(err){
      alert(err.response.data.msg)

    }
  }

  const editCategory = async(id,name)=>{
    setID(id)
    setCategory(name)
    setOnEdit(true)
  }

  const deleteCategory = async id=>{
    try{
      const res = await axios.delete(`http://localhost:8000/api/deleteCategory/${id}`,{
        headers: {Authorization: token}
      })
      alert(res.data.msg)
      setCallback(!callback)

    }catch(err){
      if (err.response) {
        alert(err.response.data.msg);
      } else if (err.request) {
        alert("No response received from server.");
      } else {
        alert("Error occurred while processing request.");
      }
    

    }
  }

  return (
    <div className='categories'>
      <form onSubmit={createCategory}>
        <label htmlFor='category'>Category</label>
        <input type='text' name='category' value={category} required onChange={e => setCategory(e.target.value)}/>
        <button type='submit'>{onEdit? "Update":"Create"}</button>
      </form>
      
      <div className='column'>
        {
          categories.map(category=>(
            <div className='rows' key={category._id}>
            <p>{category.name}</p>
            <div>
              <button onClick={()=>editCategory(category._id, category.name)}>Edit</button>
              <button onClick={()=>deleteCategory(category._id)}>Delete</button>
              </div>
          </div>

          ))
           
          } 
      </div>
    </div>
  )
}

export default Categories
