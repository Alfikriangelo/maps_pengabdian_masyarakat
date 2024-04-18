// Login.js
import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import Button from '@mui/material/Button';
import './Login.css';
import government from './p.png'
import user_icon from '../Components/Assets/person.png';
import password_icon from '../Components/Assets/password.png';

const Login = () => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });
  
      if (response.ok) {
        const userData = await response.json();
        console.log('Login berhasil', userData);
        setError(null);
        login();
        navigate('/maps');
      } else {
        console.error('Login gagal');
        const errorData = await response.json();
        setError(errorData.error || 'Login gagal. Periksa kembali nama pengguna dan kata sandi.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Something went wrong during login.');
    }
  };

  return (
    <section className='containerUtama'>
    <div className='container-login'>
      <div className='header'>
        <div className='text'>Login</div>
        <div className='underline'></div>
      </div>
      <img className='image' src={government} alt='gov' />      <div className='inputs'>
      <p className='data'>Data Kependudukan Desa</p>
        <div className='input'>
          <img src={user_icon} alt='' />
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='input'>
          <img src={password_icon} alt='' />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className='submit-container'>
        <Button
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '220px',
            height: '59px',
            color: '#fff',
            background: '#3874cb',
            borderRadius: '15px',
            fontSize: '19px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
          variant='contained'
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
      {error && <div className='error-message'>{error}</div>}
    </div>
    </section>
  );
};

export default Login;