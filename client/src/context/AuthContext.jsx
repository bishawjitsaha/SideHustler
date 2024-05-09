import React, {useState, useEffect, useMemo} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {doSignOut} from '../firebase/firebaseFunctions';
export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [setupComplete, setSetupComplete] = useState(false);
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log("User:", user);
      if (user) {
        const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com');
        setCurrentUser(user);
        if (isGoogleUser) {
          if (currentUser && !setupComplete) {
            navigate('/getting-started'); //google users
          } else if (currentUser && setupComplete) {
            
              navigate('/');  //google users
          }
        } else{
          setSetupComplete(true);
          navigate('/'); //normal users
        }
      } else {
        setCurrentUser(null);
        setProfileData({});
      }
    });
    return () => unsubscribe();
  }, [auth]);

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