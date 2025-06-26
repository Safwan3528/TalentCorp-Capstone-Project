import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', credentials);
      
      // Backend mengembalikan JWT token langsung atau dalam object
      const token = response.data.token || response.data;
      
      // Simpan user data jika tersedia
      const userData = {
        username: credentials.username,
        // Jika backend mengembalikan user data, gunakan itu
        ...(response.data.user || {})
      };
      
      login(token, userData);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Invalid username or password'
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-4 p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Welcome</h2>
          <p className="text-muted">Login to your account</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Username"
              required
              value={credentials.username}
              onChange={handleChange}
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              required
              value={credentials.password}
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">Login</button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don't have an account? <a href="/register">Register</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
