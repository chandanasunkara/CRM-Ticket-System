import React ,{useState, useEffect} from 'react';
//import { Container } from 'react-bootstrap';
import LoginForm from '../../components/login/Login.comp';
import ResetPassword from '../../components/password-reset/PasswordReset.comp';
import './entry.style.css';

export const Entry = () => {
const [email, setEmail] = useState('');

const [password, setPassword] = useState('');

const [frmLoad, setfrmLoad] = useState('login');
 

useEffect(() => {
  const script = document.createElement('script');

  script.src = './chatbot.js';
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);


const handleOnchange= e =>{
    const {name,value} = e.target;

    switch(name){
        case 'email':
            setEmail(value)
            break
        case 'password':
            setPassword(value)
            break

            default:
                break
    }
    
};

  const handleOnSubmit = e => {
    e.preventDefault()

    if(!email || !password){
        return alert("Fill up the form!");
    }
    
    console.log(email,password);
  }


  const handleOnResetSubmit = e => {
    e.preventDefault()

    if(!email ){
        return alert("Please enter the email");
    }
    
    console.log(email);
  }

  const formSwitcher = frmType =>{
    setfrmLoad(frmType);
  };

 return (
  <div className="entry-page">
  <div className="left-panel">
  <img src={require('../../assets/img/network-map.png')} alt="network-map" className="network-image" />

    <h1>Hello CRM! 👋</h1>
    <p>From Chaos to Clarity — Your Smart CRM for Smarter Customer Journeys..<br />
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
    </div>
  </div>
</div>

 
);

    

  
  
    
};

