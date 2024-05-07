import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { doSignOut } from '../firebase/firebaseFunctions';
import "../App.css";
import axios from "axios";

const Navigation = () => {
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [profileLink, setProfileLink] = useState(null)
  const { currentUser, setupComplete } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && setupComplete) {
      setUserDataLoaded(true);
      setProfileLink(currentUser.displayName)
    } else {
      setUserDataLoaded(false);
      if (!setupComplete && currentUser) {
        navigate('/getting-started');
      }
    }
  }, [currentUser, setupComplete, navigate]);
  return (
    <div>
      {currentUser ? (
        <NavigationAuth userDataLoaded={userDataLoaded} profileLink={profileLink} />
      ) : (
        <NavigationNonAuth />
      )}
    </div>
  );
};

const NavigationAuth = ({ userDataLoaded, profileLink }) => {
  const navigate = useNavigate();
  const signOutHandler = async () => {
    await doSignOut();
    navigate("/");
  };
  return (
    <div>
      <nav className="navigation">
        {userDataLoaded && (
          <>
            <NavLink className="navlink" to="/">
              Home
            </NavLink>
            <NavLink to="/search" className="navlink">
              Search
            </NavLink>
            <NavLink to="/posts" className="navlink">
              Posts
            </NavLink>
            <NavLink to="/chat" className="navlink">
              Chat
            </NavLink>
            <NavLink to="/notifications" className="navlink">
              Notifications
            </NavLink>
            <NavLink className="navlink" to={`/user/${profileLink}`}>
              Profile
            </NavLink>
          </>
        )}
      </nav>
      <button className='button' type='button' onClick={signOutHandler}>
        Sign Out
      </button>
    </div>
  );
};

const NavigationNonAuth = () => {

  return (
    <nav className="navigation">
      <NavLink className="navlink" to="/">
        Home
      </NavLink>
      <NavLink className="navlink" to="/signup">
        Sign-up
      </NavLink>
      <NavLink className="navlink" to="/signin">
        Sign-in
      </NavLink>
    </nav>
  );
};

export default Navigation;
