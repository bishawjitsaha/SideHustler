import React from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios';

function CompleteSignUp() {
  let location = useLocation();
  let navigate = useNavigate();
  const { idToken} = location.state || {};
  const handleSignUp = async (event) => {
    event.preventDefault();
    const { displayName, firstName, lastName, age } = event.target.elements;
    if( isNaN(parseInt(age.value)) || parseInt(age.value) < 18){
      alert('Age must be a valid integer and greater than 18')
    }
    
    try{
      await axios.post('http://localhost:3000/signup', {
        userName: displayName.value,
        firstName: firstName.value,
        lastName: lastName.value,
        age: parseInt(age.value)
      }, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      return navigate("/");
    } catch(e){
      alert(e);
    }
  }

  return (
    <div>
      <h2>We need just a bit more information from you!</h2>
      <br/>
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
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default CompleteSignUp