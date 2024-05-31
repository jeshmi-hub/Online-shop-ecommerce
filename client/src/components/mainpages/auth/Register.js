import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import Loading from '../../utils/loading/Loading'
import axios from 'axios'

function Register() {
  const [user, setUser] = useState({
    username:"", email: "", password:"", confirmPassword:""
  })
  const [images, setImages] = useState(false)
  const[loading, setLoading] = useState(false)



  const onChangeInput = e =>{
    const{name, value} = e.target;
    setUser({...user, [name]:value})
  }

  const handleUpload = async e=>{
    e.preventDefault()
    try{
      const file = e.target.files[0]
      if(!file) return alert("File does not exist.")
      if(file.size>1024*1024)
      return alert("Size too large!")

      if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp')
      return alert("File format is incorrect.")

      let formData = new FormData()
      formData.append('file', file)
      setLoading(true)
      const res = await axios.post('http://localhost:8000/api/uploadUserImage',formData)
      setLoading(false)
      setImages(res.data)
      console.log(res.data)
    }catch(err){
      alert(err.response.data.msg)

    }
  }

  const handleDestroy = async()=>{
    try{
      setLoading(true)
      await axios.post('http://localhost:8000/api/destroyUserImage',{
        public_id: images.public_id
      })

      setLoading(false)
      setImages(false)

    }catch(err){
      alert(err.response.data.msg)
    }
  }

  const registerSubmit = async e =>{
    e.preventDefault()
    try{
      console.log(images)
      if(!images) return alert("No Image uploaded") 
      const{public_id, url} = images
      const response = await axios.post('http://localhost:8000/api/register', {...user,image:{public_id,url}})
      localStorage.setItem('firstLogin', true)
      window.location.href = "/";
      alert(response.data.msg)
      
      setImages(false)

    }catch(err){
      alert(err.response.data.msg)
    }
  }

  const styleUpload = {
    display: images ? "block" : "none"
  }

  return (
    <div className='login-page'>
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
      <form onSubmit={registerSubmit}>
        <input type="text" name="username" required placeholder='username' value={user.username} onChange={onChangeInput}/>
        <input type="email" name="email" required placeholder='Email' value={user.email} onChange={onChangeInput}/>
        <input type="password" name='password' required autoComplete="on" placeholder='password' value={user.password} onChange={onChangeInput}/>
        <input type="password" name='confirmPassword' required autoComplete="on" placeholder='password' value={user.confirmPassword} onChange={onChangeInput}/>


        <div className='row'>
          <button type='submit'>Register</button>
          <Link to="/login">Login</Link>
        </div>
      </form>
      
    </div>
  )
}

export default Register

