import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ConnectForm.css';
import { toast } from 'react-toastify';
import generateToastContainer from '../utils/ToastContainer';
import { fetchGraphQL } from '../api/apiCall';
import TokenStore from '../api/tokenStore';
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";


const connectionRequest = gql`
  query Connection($login: String!, $password: String!) {
    connection(input: { login: $login, password: $password }) {
      token
      error
    }
  }
`;

function ConnectForm(){
  const navigate = useNavigate();
  const  [login, setLogin] = useState<string>('johndoe');
  const  [password, setPassword] = useState<string>('password123');
  const {refetch} = useQuery({ //replace with refetch event probably
    queryKey: ["fetchConnection", login, password],
    queryFn: async() => await fetchGraphQL(connectionRequest, { login: login, password: password }),
    refetchOnWindowFocus: false,
    enabled: false
  });
  

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
      const {data,isError} = await refetch();
      console.log("Error:", isError); // logs if there was an error during the request
      console.log("Data:", data.connection.token); // logs your connection object
      if (data.connection.token !== null) {
        TokenStore.setToken(data.connection.token);
        navigate("/espaces");
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