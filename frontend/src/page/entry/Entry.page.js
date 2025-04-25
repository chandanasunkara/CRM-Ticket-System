import React ,{useState} from 'react';
import LoginForm from '../../components/login/Login.comp';
import ResetPassword from '../../components/password-reset/PasswordReset.comp';
import RegisterForm from '../../components/register/Register.comp';
import networkMap from '../../assets/img/network-map.png';
import './entry.style.css';

export const Entry = () => {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [name, setName] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('')

  const [frmLoad, setfrmLoad] = useState('login');



  const handleOnchange= e =>{
    const {name,value} = e.target;

    switch(name){
      case 'name':
        setName(value);
        break
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'confirmPassword':
        setConfirmPassword(value);
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

  const handleOnRegisterSubmit = e => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return alert("Please fill in all fields");
    }

    if (password !== confirmPassword){
      return alert("Passwords do not match!");
    }

    console.log({ name, email, password, confirmPassword })
  }

  const formSwitcher = frmType =>{
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
          />
        )}
      </div>
    </div>
  </div>
  );
};

