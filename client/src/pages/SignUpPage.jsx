import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {doCreateUserWithEmailAndPassword} from '../firebase/firebaseFunctions';
import {AuthContext} from '../context/AuthContext';
import SocialSignIn from '../components/SocialSignIn';
import axios from 'axios';
function SignUpPage(props) {
  const {currentUser} = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const handleSignUp = async (event) => {
    event.preventDefault();
    const {displayName, email, passwordOne, passwordTwo, firstName, lastName, age} = event.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch('Passwords do not match');
      return false;
    }
    try{
      let {data} = await axios.get(`http://localhost:3000/user/verifyUser/${displayName.value}`, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      });
      console.log(data.isUserNameUnique);
      if(data.isUserNameUnique === false){
        alert("That username already exists");
        return false;
      }
    } catch (e){
      console.log(e);
    }
    try {
      let user = await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );
      await axios.post('http://localhost:3000/signup', {
        userName: displayName.value,
        firstName: firstName.value,
        lastName: lastName.value,
        age: parseInt(age.value),
        isSocialSignUp: false
      }, {
        headers: {
          Authorization: `Bearer ${user.idToken}`
        }
      });
    } catch (e) {
      alert(e);
    }
  };

  if (currentUser) {
    return <Navigate to='/' />;
  }

  return (
    <div className='card'>
      <h1>Sign up</h1>
      {pwMatch && <h4 className='error'>{pwMatch}</h4>}
      <form onSubmit={handleSignUp}>
        <div className='form-group'>
          <label>
            Username:
            <br />
            <input
              className='form-control'
              required
              name='displayName'
              type='text'
              placeholder='Name'
              autoFocus={true}
            />
          </label>
          
          <div className='form-group'>
          <label>
            First Name:
            <br />
            <input
              className='form-control'
              required
              name='firstName'
              type='firstName'
              placeholder='firstName'
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Last Name:
            <br />
            <input
              className='form-control'
              required
              name='lastName'
              type='lastName'
              placeholder='lastName'
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            age:
            <br />
            <input
              className='form-control'
              required
              name='age'
              type='age'
              placeholder='age'
            />
          </label>
        </div>
        </div>
        <div className='form-group'>
          <label>
            Email:
            <br />
            <input
              className='form-control'
              required
              name='email'
              type='email'
              placeholder='Email'
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Password:
            <br />
            <input
              className='form-control'
              id='passwordOne'
              name='passwordOne'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Confirm Password:
            <br />
            <input
              className='form-control'
              name='passwordTwo'
              type='password'
              placeholder='Confirm Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <button
          className='button'
          id='submitButton'
          name='submitButton'
          type='submit'
        >
          Sign Up
        </button>
        
      </form>
      <br />
      <SocialSignIn/>
    </div>
  );
}


export default SignUpPage;