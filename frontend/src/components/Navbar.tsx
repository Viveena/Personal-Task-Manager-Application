import React, { useContext, type JSX } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../css/Navbar.css'

const Navbar = (): JSX.Element => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <h1>Task Manager</h1>
      <div className="nav-content">
        {user ? (
          <div className="nav-menu authenticated">
            <div className="nav-links">
              
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
