import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SignOutButton from "./SignOut.jsx";
import "../App.css";

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <div>
      <nav className="navigation">
        <NavLink className="navlink" to="/">
          Home
        </NavLink>
        <NavLink to="/search" className="navlink">
          Search
        </NavLink>
        <NavLink to="/posts" className="navlink">
          Posts
        </NavLink>
      </nav>
      <SignOutButton />
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
      {/* <NavLink className ="navlink" to={`/user/${currentUser.displayName}`}>
        Profile
      </NavLink> */}
    </nav>
  );
};

export default Navigation;
