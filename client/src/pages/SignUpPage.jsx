import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {doCreateUserWithEmailAndPassword} from '../firebase/firebaseFunctions';
import {AuthContext} from '../context/AuthContext';
import SocialSignIn from '../components/SocialSignIn';
import { validateAge, validateUsername, validateName, validateEmail } from '../validation/userValidation';
import axios from 'axios';
function SignUpPage(props) {
  const {currentUser, setCurrentUser} = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const handleSignUp = async (event) => {
    event.preventDefault();
    let {displayName, email, passwordOne, passwordTwo, firstName, lastName, age} = event.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch('Passwords do not match');
      return false;
    }
    try{
      displayName = validateUsername(displayName.value);
      age = validateAge(parseInt(age.value));
      firstName = validateName(firstName.value);
      lastName = validateName(lastName.value);
      email = validateEmail(email.value);
    } catch(e){
      alert(e);
      return false;
    }
    try{
      let {data} = await axios.get(`https://sidehustler-backend.onrender.com/user/verifyUser/${displayName}`);
      console.log(data.isUserNameUnique);
      if(data.isUserNameUnique === false){
        alert("That username already exists");
        return false;
      }
    } catch (e){
      alert(e)
    }
    try {
      
      let user = await doCreateUserWithEmailAndPassword(
        email,
        passwordOne.value,
        displayName
      );
      setCurrentUser(user);
      await axios.post('https://sidehustler-backend.onrender.com/signup', {
        userName: displayName,
        firstName: firstName,
        lastName: lastName,
        age: age,
        isSocialSignUp: false
      }, {
        headers: {
          Authorization: `Bearer ${user.idToken}`
        }
      });

    } catch (e) {
      console.log(e);
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