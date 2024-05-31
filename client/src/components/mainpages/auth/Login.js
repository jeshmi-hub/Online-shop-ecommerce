import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [user, setUser] = useState({
    email: "", password:""
  })

  const onChangeInput = e =>{
    const{name, value} = e.target;
    setUser({...user, [name]:value})
  }

  const loginSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      const res = await axios.post('http://localhost:8000/api/login', { ...user },{
        headers: {Accept: "application/json", "Content-Type": "application/json"},
        withCredentials: true
        
      });
      console.log(res);
      localStorage.setItem('firstLogin', true);
      window.location.href = "/";
    } catch (err) {
      alert(err.response.data.msg);
    }
  };
  return (
    <div className='login-page'>
      <form>
        <input type="email" name="email" required placeholder='Email' value={user.email} onChange={onChangeInput}/>
        <input type="password" name='password' required autoComplete="on" placeholder='password' value={user.password} onChange={onChangeInput}/>

        <div className='row'>
        <button type='submit' onClick={(event) => loginSubmit(event)}>Login</button>

          <Link to="/register">Register</Link>
        </div>
      </form>
      
    </div>
  )
}

export default Login
