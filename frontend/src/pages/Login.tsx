import React, { useState, useContext, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import '../css/AuthForm.css';

const Login = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error('Login failed. Invalid credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-visual">
        <h1>Welcome Back!</h1>
        <p>
          Sign in to your account and continue managing your tasks efficiently. 
          Your productivity journey continues here.
        </p>
        <div className="features">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>Lightning fast task management</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <span>Secure and private workspace</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Track your productivity</span>
          </div>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="auth-form">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <div className="form-footer">
            <p>Don't have an account?</p>
            <a href="/register">Create one here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;