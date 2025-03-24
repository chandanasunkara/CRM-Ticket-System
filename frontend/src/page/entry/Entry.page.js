import React ,{useState} from 'react';
import { Container } from 'react-bootstrap';
import LoginForm from '../../components/login/Login.comp';

import './entry.style.css';

export const Entry = () => {
// eslint-disable-next-line no-unused-vars
const [email, setEmail] = useState('');

// eslint-disable-next-line no-unused-vars
const [password, setPassword] = useState('');

 
const handleOnchange= e =>{
    const {name,value} = e.target
    console.log(name,value)
}

  return (
    <div className="entry-page bg-success d-flex justify-content-center align-items-center vh-100">
      <Container className="d-flex justify-content-center">
       <LoginForm handleOnchange={handleOnchange}/>
      </Container>
    </div>
  );
};




