import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { doUpdateUserDisplayName } from '../firebase/firebaseFunctions';
import { useNavigate, Navigate } from 'react-router-dom';
import { validateAge, validateUsername, validateName } from '../validation/userValidation';
import { backendUrl } from '../App';

function GettingStarted(){
  const { currentUser, setSetupComplete, setupComplete} = useContext(AuthContext); 
  let navigate = useNavigate();
  useEffect(() => {
    if (setupComplete) {
      navigate('/'); 
    }
  }, [setupComplete, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let {userName, firstName, lastName, age} = event.target.elements;
    try{
      userName = validateUsername(userName.value);
      age = validateAge(parseInt(age.value));
      firstName = validateName(firstName.value);
      lastName = validateName(lastName.value);
    } catch(e){
      alert(e);
      return false;
    }
    try{
      let {data} = await axios.get(`${backendUrl}/user/verifyUser/${userName}`)
      console.log(data.isUserNameUnique);
      if(data.isUserNameUnique === false){
        alert("That username already exists");
        return false;
      }
    } catch (e){
      console.log(e);
    }
    try {
      const user = await axios.post(`${backendUrl}/user/addInfo`, {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        age: age
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      });
      await doUpdateUserDisplayName(userName);
      setSetupComplete(true);
        navigate("/");
    } catch (e) {
      alert(e);
    }
  };
  return(
    <div className='flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className="max-w-md w-full space-y-8">
        <h1 className="mt-2 text-center text-4xl font-bold text-gray-900">Getting Started</h1>
        <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label>
                Username:
                <br />
                <input
                  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  required
                  name='userName'
                  type='text'
                  placeholder='Name'
                  autoFocus={true}
                />
              </label>
            </div>
            <br />
            <div>
              <label>
                First Name:
                <br />
                <input
                  className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  required
                  name='firstName'
                  type='firstName'
                  placeholder='firstName'
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
                  placeholder='lastName'
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
                  placeholder='age'
                />
              </label>
            </div>
          </div>
          <br/>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4'
            id='submitButton'
            name='submitButton'
            type='submit'
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
  
}

export default GettingStarted;