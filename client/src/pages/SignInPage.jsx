import React, {useContext} from 'react';
import { SocialSignIn } from '../components';
import {Navigate, useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {
  doSignInWithEmailAndPassword
} from '../firebase/firebaseFunctions.js';
  function SignInPage() {
    let navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);
    const handleLogin = async (event) => {
      event.preventDefault();
      let {email, password} = event.target.elements;

      try {
        await doSignInWithEmailAndPassword(email.value, password.value);
      } catch (error) {
        alert(error);
      }
    };
    const passwordReset = () => {
      // event.preventDefault();
      // let email = document.getElementById('email').value;
      // if (email) {
      //   doPasswordReset(email);
      //   alert('Password reset email was sent');
      // } else {
      //   alert(
      //     'Please enter an email address below before you click the forgot password link'
      //   );
      // }
      navigate('/forgot');
    };
    if (currentUser) {
      return <Navigate to='/' />;
    }
    return (
      <div>
        <div className='card'>
          <h1>Log-In</h1>
          <form className='form' onSubmit={handleLogin}>
            <div className='form-group'>
              <label>
                Email Address:
                <br />
                <input
                  name='email'
                  id='email'
                  type='email'
                  placeholder='Email'
                  autoFocus={true}
                />
              </label>
            </div>
            <br />
            <div className='form-group'>
              <label>
                Password:
                <br />
                <input
                  name='password'
                  type='password'
                  placeholder='Password'
                  autoComplete='off'
                />
              </label>
            </div>
  
            <button className='button' type='submit'>
              Log in
            </button>
  
            <button className='forgotPassword' onClick={passwordReset}>
              Forgot Password
            </button>
          </form>
  
          <br />
          <SocialSignIn />
        </div>
      </div>
    );

}

export default SignInPage;