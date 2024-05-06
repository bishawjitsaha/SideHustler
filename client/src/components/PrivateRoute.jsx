import {Navigate} from 'react-router-dom';
import React, {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';

const PrivateRoute = ({children }) => {
  let { currentUser } = useContext(AuthContext)
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;