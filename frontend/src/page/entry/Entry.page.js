import React, { useState } from 'react';
import axios from 'axios';
import LoginForm from '../../components/login/Login.comp';
import ResetPassword from '../../components/password-reset/PasswordReset.comp';
import RegisterForm from '../../components/register/Register.comp';
import networkMap from '../../assets/img/network-map.png';
import './entry.style.css';

export const Entry = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [frmLoad, setfrmLoad] = useState('login');

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Fill up the form!");
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      // Redirect user to dashboard or home page
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Login failed!');
    }
  };

  const handleOnResetSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      return alert("Please enter the email");
    }

    console.log(email);
    
  };

  const handleOnRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return alert("Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      console.log('Registration successful:', data);
      alert('Registration successful! Please login.');
      // After successful register, switch to login form
      setfrmLoad('login');
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      alert('Registration failed!');
    }
  };

  const formSwitcher = (frmType) => {
    setfrmLoad(frmType);
  };

  return (
    <div className="entry-page">
      <div className="left-panel">
        <img src={networkMap} alt="network-map" className="network-image" />
        <h1>Hello CRM! 👋</h1>
        <p>
          From Chaos to Clarity — Your Smart CRM for Smarter Customer Journeys.
          <br />
          Smarter Conversations. Stronger Relationships. Better Business.
        </p>
      </div>

      <div className="right-panel">
        <div className="login-card">
          {frmLoad === 'login' && (
            <LoginForm
              handleOnchange={handleOnchange}
              handleOnSubmit={handleOnSubmit}
              formSwitcher={formSwitcher}
              email={email}
              password={password}
            />
          )}
          {frmLoad === 'reset' && (
            <ResetPassword
              handleOnchange={handleOnchange}
              handleOnResetSubmit={handleOnResetSubmit}
              formSwitcher={formSwitcher}
              email={email}
            />
          )}
          {frmLoad === 'register' && (
            <RegisterForm
              handleOnchange={handleOnchange}
              handleOnRegisterSubmit={handleOnRegisterSubmit}
              formSwitcher={formSwitcher}
              name={name}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
};
