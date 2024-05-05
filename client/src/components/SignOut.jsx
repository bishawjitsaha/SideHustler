import React from 'react';
import {doSignOut} from '../firebase/firebaseFunctions';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
  let navigate = useNavigate();
  function buttonHandler(){
    doSignOut();
    navigate("/");
  }

  return (
    <button className='button' type='button' onClick={buttonHandler}>
      Sign Out
    </button>
  );
};

export default SignOutButton;