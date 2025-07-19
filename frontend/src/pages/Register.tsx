import React, { useState, useContext, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import '../css/AuthForm.css';

const Register = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(username, email, password);
    if (success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-visual">
        <h1>Join Task Manager</h1>
        <p>
          Create your account and start organizing your tasks like never before. 
          Join thousands of users who trust us with their productivity.
        </p>
        <div className="features">
          <div className="feature">
            <span className="feature-icon">🚀</span>
            <span>Get started in seconds</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💼</span>
            <span>Professional task management</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <span>Achieve your goals faster</span>
          </div>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="auth-form">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                disabled={loading}
                placeholder="Choose a username"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={loading}
                placeholder="Create a password"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          <div className="form-footer">
            <p>Already have an account?</p>
            <a href="/login">Sign in here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;