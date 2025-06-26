import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-wallet2 me-2"></i>
          ExpenseTracker
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    <i className="bi bi-house me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/analytics">
                    <i className="bi bi-graph-up me-1"></i>
                    Analytics
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {/* Theme Toggle */}
            <li className="nav-item">
              <button 
                className="btn btn-outline-secondary nav-link border-0" 
                onClick={toggleTheme}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'}`}></i>
              </button>
            </li>

            {user ? (
              <>
                {/* User Info */}
                <li className="nav-item d-flex align-items-center">
                  <span className="navbar-text me-3">
                    <i className="bi bi-person-circle me-1"></i>
                    Welcome, <strong>{user.username || 'User'}</strong>
                  </span>
                </li>
                
                {/* Logout Button */}
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-danger" 
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-person-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
