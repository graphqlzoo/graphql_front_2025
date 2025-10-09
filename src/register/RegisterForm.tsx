import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';
import { toast } from 'react-toastify';
import generateToastContainer from '../utils/ToastContainer';
import TokenStore from '../api/tokenStore';
import { fetchGraphQL } from '../api/apiCall';
import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';

const registerMutation = gql`
  mutation Register($input: RegisterInput) {
    register(input: $input) {
      token
      error
    }
  }
`;

function RegisterForm() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleInputChange = (state: React.Dispatch<React.SetStateAction<string>>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      state(e.target.value);
    };
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () =>
      await fetchGraphQL(registerMutation, {
        input: { firstName, lastName, email, login, password },
      }),
  });

    const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!login || !password || !email || !firstName || !lastName) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const data: any = await mutateAsync();

      console.log('Register response:', data);

      if (data?.register?.token) {
        TokenStore.setToken(data.register.token);
        toast.success('Register successfully, please connect');
        navigate('/');
      } else {
        toast.error(data?.register?.error || 'Failed to register, try again');
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="title">Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={firstName}
            onChange={handleInputChange(setFirstName)}
          />
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={lastName}
            onChange={handleInputChange(setLastName)}
          />
        </div>
        <div>
          <input
            type="text"
            name="email"
            placeholder="xxx@xxx.com"
            value={email}
            onChange={handleInputChange(setEmail)}
          />
        </div>
        <div>
          <input
            type="text"
            name="login"
            placeholder="xxx"
            value={login}
            onChange={handleInputChange(setLogin)}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="@&p1"
            value={password}
            className="input-field"
            onChange={handleInputChange(setPassword)}
          />
        </div>
        <input type="submit" value={isPending ? 'Registering...' : 'Register'} disabled={isPending} />
      </form>
      {generateToastContainer()}
    </div>
  );
}

export default RegisterForm;
