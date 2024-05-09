import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate,Navigate } from "react-router-dom";
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
    if(currentUser  && !setupComplete){
      navigate("/getting-started");
    }
    else{
      if (currentUser) {
        setUserDataLoaded(true);
        setProfileLink(currentUser.displayName)
      } else {
        setUserDataLoaded(false);
      }
    }
  }, [currentUser, setupComplete, navigate]);
  return (
    <div className="bg-teal-400 text-white">
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
      <nav className="bg-teal-400 p-4 text-white flex justify-center">
        {userDataLoaded && (
          <>
            <NavLink className="bg-white text-blue-500 px-3 py-2 rounded hover:bg-gray-300" to="/">
              Home
            </NavLink>
            <NavLink to="/search" className="bg-white text-blue-500 px-3 py-2 rounded ml-2 hover:bg-gray-300">
              Search
            </NavLink>
            <NavLink to="/posts" className="bg-white text-blue-500 px-3 py-2 rounded ml-2 hover:bg-gray-300">
              Posts
            </NavLink>
            <NavLink to="/chat" className="bg-white text-blue-500 px-3 py-2 rounded ml-2 hover:bg-gray-300">
              Chat
            </NavLink>
            <NavLink to="/notifications" className="bg-white text-blue-500 px-3 py-2 rounded ml-2 hover:bg-gray-300">
              Notifications
            </NavLink>
            <NavLink className="bg-white text-blue-500 px-3 py-2 rounded ml-2 hover:bg-gray-300" to={`/user/${profileLink}`}>
              Profile
            </NavLink>
            <NavLink
              className="bg-white text-blue-500 px-3 py-2 rounded ml-2 hover:bg-gray-300"
              to="/"
              onClick={signOutHandler}>
              Sign Out
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

const NavigationNonAuth = () => {

  return (
    <nav className="bg-teal-400 p-4 text-white flex justify-center">
      <NavLink className="bg-white text-blue-500 px-3 py-2 rounded ml-2 hover:bg-gray-300" to="/">
        Home
      </NavLink>
      <NavLink className="bg-white text-blue-500 px-3 py-2 rounded ml-2 hover:bg-gray-300" to="/signup">
        Sign-up
      </NavLink>
      <NavLink className="bg-white text-blue-500 px-3 py-2 rounded ml-2 hover:bg-gray-300" to="/signin">
        Sign-in
      </NavLink>
    </nav>
  );
};

export default Navigation;
