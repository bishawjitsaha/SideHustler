import React from 'react'
import { doPasswordReset } from '../firebase/firebaseFunctions';
function ForgotPasswordPage() {

  const handleReset = (event) => {
    event.preventDefault();
      let email = document.getElementById('email').value;
      if (email) {
        doPasswordReset(email);
        alert('Password reset email was sent');
      } else {
        alert(
          'Please enter an email address below before you click the forgot password link'
        );
      }
  }
  
  return (
    <div>
      <div className='card'>
          <h1>Forgot Password</h1>
          <p>We will send you a password reset link</p>
          <form className='form' onSubmit={handleReset}>
            <div className='form-group'>
              <label>
                Email Address:
                <br />
                <input
                  name='email'
                  id='email'
                  type='email'
                  placeholder='Email'
                  required
                  autoFocus={true}
                />
              </label>
              </div>
              <button className='button' type='submit'>
              Reset Password
            </button>
            </form>
            </div>
    </div>
  )
}

export default ForgotPasswordPage