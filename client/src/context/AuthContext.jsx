import React, {useState, useEffect, useMemo} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [setupComplete, setSetupComplete] = useState(true);
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log("User:", user);
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setProfileData({});
      }
    });
    return () => unsubscribe();
  }, [auth,currentUser]);

  const contextValue = useMemo(() => ({
    currentUser,
    profileData,
    setProfileData,
    setupComplete,
    setSetupComplete,
    setCurrentUser
  }), [currentUser, profileData, setupComplete]);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};