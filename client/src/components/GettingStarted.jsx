import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { doUpdateUserDisplayName } from '../firebase/firebaseFunctions';
import { useNavigate, Navigate } from 'react-router-dom';
import { validateAge, validateUsername, validateName } from '../validation/userValidation';

function GettingStarted(){
  const { currentUser, setSetupComplete, setupComplete} = useContext(AuthContext); 
  let navigate = useNavigate();
  useEffect(() => {
    if (setupComplete) {
      navigate('/'); 
    }
  }, [setupComplete, navigate]);
  const refreshUser = async () => {
    await currentUser.getIdToken(true);
  };

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
      let {data} = await axios.get(`https://localhost:3000/user/verifyUser/${userName}`)
      console.log(data.isUserNameUnique);
      if(data.isUserNameUnique === false){
        alert("That username already exists");
        return false;
      }
    } catch (e){
      console.log(e);
    }
    try {
      const user = await axios.post(`https://localhost:3000/user/addInfo`, {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        age: age
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      });
      doUpdateUserDisplayName(userName);
      await refreshUser();
      setSetupComplete(true);
        navigate("/");
    } catch (e) {
      alert(e);
    }
  };
  return(
    <div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>
            Username:
            <br />
            <input
              className='form-control'
              required
              name='userName'
              type='text'
              placeholder='Name'
              autoFocus={true}
            />
          </label>
          </div>
          
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
        <button
          className='button'
          id='submitButton'
          name='submitButton'
          type='submit'
        >
          Submit
        </button>
        
      </form>
    </div>
  )
  
}

export default GettingStarted;