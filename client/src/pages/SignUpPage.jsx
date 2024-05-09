import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/firebaseFunctions';
import { AuthContext } from '../context/AuthContext';
import SocialSignIn from '../components/SocialSignIn';
import { validateAge, validateUsername, validateName, validateEmail } from '../validation/userValidation';
import axios from 'axios';
import { backendUrl } from '../App';
function SignUpPage(props) {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const handleSignUp = async (event) => {
    event.preventDefault();
    let { displayName, email, passwordOne, passwordTwo, firstName, lastName, age } = event.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch('Passwords do not match');
      return false;
    }
    try {
      displayName = validateUsername(displayName.value);
      age = validateAge(parseInt(age.value));
      firstName = validateName(firstName.value);
      lastName = validateName(lastName.value);
      email = validateEmail(email.value);
    } catch (e) {
      alert(e);
      return false;
    }
    try {
      let { data } = await axios.get(`${backendUrl}/user/verifyUser/${displayName}`);
      console.log(data.isUserNameUnique);
      if (data.isUserNameUnique === false) {
        alert("That username already exists");
        return false;
      }
    } catch (e) {
      alert(e)
    }
    try {

      let user = await doCreateUserWithEmailAndPassword(
        email,
        passwordOne.value,
        displayName
      );
      setCurrentUser(user);
      await axios.post(`${backendUrl}/signup`, {
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
    <div className='flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className="max-w-md w-full space-y-8">
        <h1 className="mt-2 text-center text-4xl font-bold text-gray-900">Sign up</h1>
      {pwMatch && <h4 className='error'>{pwMatch}</h4>}
        <form onSubmit={handleSignUp} className='mt-8 space-y-6'>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label>
                Username:
                <br />
                <input
                  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  required
                  name='displayName'
                  type='text'
                  placeholder='Username'
                  autoFocus={true}
                />
              </label>
            </div>
            <br/>
            <div>
              <label>
                First Name:
                <br />
                <input
                  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  required
                  name='firstName'
                  type='firstName'
                  placeholder='First name'
                />
              </label>
            </div>
            <br/>
            <div>
              <label>
                Last Name:
                <br />
                <input
                  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  required
                  name='lastName'
                  type='lastName'
                  placeholder='Last name'
                />
              </label>
            </div>
            <br/>
            <div>
              <label>
                age:
                <br />
                <input
                  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  required
                  name='age'
                  type='age'
                  placeholder='Age'
                />
              </label>
            </div>
            <br/>
            <div>
              <label>
                Email:
                <br />
                <input
                  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  required
                  name='email'
                  type='email'
                  placeholder='Email'
                />
              </label>
            </div>
            <br/>
            <div>
              <label>
                Password:
                <br />
                <input
                  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  id='passwordOne'
                  name='passwordOne'
                  type='password'
                  placeholder='Password'
                  autoComplete='off'
                  required
                />
              </label>
            </div>
            <br/>
            <div>
              <label>
                Confirm Password:
                <br />
                <input
                  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  name='passwordTwo'
                  type='password'
                  placeholder='Confirm Password'
                  autoComplete='off'
                  required
                />
              </label>
            </div>
          </div>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4'
          id='submitButton'
          name='submitButton'
          type='submit'
        >
          Sign Up
        </button>
      </form>
      <br />
      <SocialSignIn />
      </div>
    </div>
  );
}


export default SignUpPage;