import React ,{useState} from 'react';
import LoginForm from '../../components/login/Login.comp';
import ResetPassword from '../../components/password-reset/PasswordReset.comp';
import RegisterForm from '../../components/register/Register.comp';
import networkMap from '../../assets/img/network-map.png';
import './entry.style.css';
import api from '../../config/api';
import { useNavigate } from 'react-router-dom';

export const Entry = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('customer');
  const [frmLoad, setfrmLoad] = useState('login');

  const handleOnchange = e => {
    const {name, value} = e.target;
    switch(name) {
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
      case 'phone':
        setPhone(value);
        break;
      case 'company':
        setCompany(value);
        break;
      case 'role':
        setRole(value);
        break;
      default:
        break;
    }
  };

  const handleOnSubmit = async e => {
    e.preventDefault();
    if(!email || !password) {
      return alert("Fill up the form!");
    }
    
    try {
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login successful:', response.data);
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleOnResetSubmit = async e => {
    e.preventDefault();
    if(!email) {
      return alert("Please enter the email");
    }
    
    try {
      const response = await api.post('/api/auth/reset-password', { email });
      console.log('Password reset email sent:', response.data);
      alert('Password reset instructions sent to your email.');
    } catch (error) {
      console.error('Password reset failed:', error);
      alert('Failed to send reset instructions. Please try again.');
    }
  };

  const handleOnRegisterSubmit = async e => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return alert("Please fill in all required fields");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const response = await api.post('/api/auth/register', { 
        name, 
        email, 
        password,
        phone,
        company,
        role
      });
      console.log('Registration successful:', response.data);
      alert('Registration successful! Please login.');
      setfrmLoad('login');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const formSwitcher = frmType => {
    setfrmLoad(frmType);
  };

  return (
    <div className="entry-page">
      <div className="left-panel">
        <img src={networkMap} alt="network-map" className="network-image" />
        <h1>Hello CRM! 👋</h1>
        <p>From Chaos to Clarity — Your Smart CRM for Smarter Customer Journeys.<br />
        Smarter Conversations. Stronger Relationships. Better Business.</p>
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
              phone={phone}
              company={company}
              role={role}
            />
          )}
        </div>
      </div>
    </div>
  );
};

