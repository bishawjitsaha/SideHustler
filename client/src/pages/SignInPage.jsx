import React, {useContext} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import SocialSignIn from '../components/SocialSignIn.jsx';
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
     <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
          <h1 className="mt-2 text-center text-4xl font-bold text-gray-900">Log-In</h1>
          <form className='mt-8 space-y-6' onSubmit={handleLogin}>
            <div className='rounded-md shadow-sm -space-y-px'>
              <div>
                <label>
                    Email Address:
                    <br />
                    <input
                    name='email'
                    id='email'
                    type='email'
                    placeholder='Email'
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    autoFocus={true}
                    />
                </label>
              </div>
            <br />
              <div>
                <label>
                    Password:
                    <br />
                    <input
                    name='password'
                    type='password'
                    placeholder='Password'
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    autoComplete='off'
                    />
                </label>
              </div>
            </div>
  
            <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4' type='submit'>
              Log in
            </button>
  
            <button className='text-blue-500 hover:text-blue-600 font-bold mr-4' onClick={passwordReset}>
              Forgot Password
            </button>
          </form>
  
          <SocialSignIn/>
        </div>
      </div>
    );

}

export default SignInPage;