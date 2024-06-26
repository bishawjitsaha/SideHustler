import React, {useContext} from 'react';
import {doSocialSignIn} from '../firebase/firebaseFunctions';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { backendUrl } from '../App';
const SocialSignIn = (props) => {
  const {setSetupComplete} = useContext(AuthContext)
  const navigate = useNavigate();
  const socialSignOn = async () => {
    try {
      let newSocialSignUp = await doSocialSignIn();
      let user =  newSocialSignUp.result.user;
      let idToken = newSocialSignUp.idToken
      if(newSocialSignUp.newUser){
        await axios.post(`${backendUrl}/signup`, {
          email: user.email,
          isSocialSignUp: true
        }, {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        });
        setSetupComplete(false);
        navigate("/getting-started");
      }
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  return (
    <div className="flex justify-center items-center mt-4">
      <img
        onClick={() => socialSignOn()}
        alt='google signin'
        src='/imgs/btn_google_signin.png'
      />
    </div>
  )
};

export default SocialSignIn;