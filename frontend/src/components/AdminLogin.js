import React,{useState} from 'react';
import axios from 'axios';

function AdminLogin() {
  const [username,setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('')

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:5000/admin/login',{username,password});
      localStorage.setItem('token',response.data.token);
      setMessage('Login successful!');
    }catch(error){
      setMessage('Login failed: '+ error.response.data);
    }
  };
  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Username' onChange={(e)=>setUsername(e.target.value)}/>
        <input type='password' placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
        <button type='submit'>Login</button>

      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default AdminLogin