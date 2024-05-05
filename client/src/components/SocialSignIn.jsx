import React from 'react';
import {doSocialSignIn} from '../firebase/firebaseFunctions';
import { useNavigate } from 'react-router-dom';

const SocialSignIn = (props) => {
  let navigate = useNavigate();
  const socialSignOn = async () => {
    try {
      let result = await doSocialSignIn();
      if(result.flag){
        navigate("/complete-signup" , { state: { idToken: result.idToken } });
      }
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