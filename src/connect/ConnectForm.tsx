import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ConnectForm.css';
import { toast } from 'react-toastify';
import generateToastContainer from '../utils/ToastContainer';
import { apiCall } from '../api/apiCall';
import TokenStore from '../api/tokenStore';

function ConnectForm(){
  const navigate = useNavigate();
  const  [login, setLogin] = useState<string>('customer');
  const  [password, setPassword] = useState<string>('customer');

  const handleInputChange = (state : React.Dispatch<React.SetStateAction<string>>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      state(e.target.value);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    if(login === '' || password === ''){
      toast.error("Please fill in both fields.");
    }
    else{
      const response = await apiCall('auth/login',"POST",{
        login: login,
        password,
      })

      if (response?.ok) {
        const data = await response.json();
        TokenStore.setToken(data.session);
        navigate('/zoos');
      } else {
        toast.error("Failed to connect,try again");
      } 
    }
  }

  return (
    <div>
      <h2 className='title'>Connection</h2>
      <form 
        onSubmit={handleSubmit}    
      >
        <div>
          <input type="text" name="email" placeholder="xxx" value={login}
            onChange={handleInputChange(setLogin)} //generate a function from a function (result = (e)=>setLogin(e.target.value))
          />
        </div>
        <div>
          <input type="password" name="password" placeholder="@&p1"  value={password} className="input-field"
            onChange={handleInputChange(setPassword)} 
          />
        </div>
        <input type="submit" value="Connect"/>
      </form>
      <div>
        <Link to="/register">Go to Register</Link>
      </div>
      {generateToastContainer()}
    </div>
    
  )
}

export default ConnectForm;