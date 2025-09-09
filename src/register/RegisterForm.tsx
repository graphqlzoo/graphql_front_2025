import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { apiCall } from '../api/apiCall';
import TokenStore from '../api/tokenStore';
import generateToastContainer from '../utils/ToastContainer';

function RegisterForm(){
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email,setEmail] = useState<string>('')
  const  [login, setLogin] = useState<string>('');
  const  [password, setPassword] = useState<string>('');

  const handleInputChange = (state : React.Dispatch<React.SetStateAction<string>>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      state(e.target.value);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault();
      if(login === '' || password === '' || email === ''|| firstName === '' || lastName === ''){
        toast.error("Please fill in both fields.");
      }
      else{
        const response = await apiCall('auth/subscribe',"POST",{
          lastName,
          firstName,
          login,
          password,
          email
        })
        console.log(response);
        if (response?.ok) {
          const data = await response.json();
          TokenStore.setToken(data.token);
          toast.success("Register successfully, please connect")
          navigate('/');
        } else {
          toast.error("Failed to register,try again");
        } 
      }
    }

    return (
    <div>
      <h2 className='title'>Inscription</h2>
      <form 
        onSubmit={handleSubmit}    
      >
        <div>
          <input type="text" name="firstName" placeholder="First name" value={firstName}
            onChange={handleInputChange(setFirstName)} //generate a function from a function (result = (e)=>setLogin(e.target.value))
          />
        </div>
        <div>
          <input type="text" name="lastName" placeholder="Last name" value={lastName}
            onChange={handleInputChange(setLastName)} //generate a function from a function (result = (e)=>setLogin(e.target.value))
          />
        </div>
        <div>
          <input type="text" name="email" placeholder="xxx@xxx.com" value={email}
            onChange={handleInputChange(setEmail)} //generate a function from a function (result = (e)=>setLogin(e.target.value))
          />
        </div>
        <div>
          <input type="text" name="login" placeholder="xxx" value={login}
            onChange={handleInputChange(setLogin)} //generate a function from a function (result = (e)=>setLogin(e.target.value))
          />
        </div>
        <div>
          <input type="password" name="password" placeholder="@&p1"  value={password} className="input-field"
            onChange={handleInputChange(setPassword)} 
          />
        </div>
        <input type="submit" value="Register"/>
      </form>
      {generateToastContainer()}
    </div>    
  )
}

export default RegisterForm;