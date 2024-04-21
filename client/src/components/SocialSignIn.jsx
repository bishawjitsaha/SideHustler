import React from 'react';
import {doSocialSignIn} from '../firebase/firebaseFunctions';

const SocialSignIn = (props) => {
  const eventType = (type) =>{

  }

  const socialSignOn = async () => {
    try {
      await doSocialSignIn();
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <img
        onClick={() => socialSignOn()}
        alt='google signin'
        src='/imgs/btn_google_signin.png'
      />
    </div>
  );
};

export default SocialSignIn;