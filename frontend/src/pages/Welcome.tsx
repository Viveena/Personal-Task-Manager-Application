import React, { type JSX } from 'react';
import { Link } from 'react-router-dom';

const Welcome = (): JSX.Element => {
  return (
    <div className="welcome-container">
      <h1>Welcome to Task Manager</h1>
      <p>
        Organize your life with our beautiful and intuitive task management application. 
        Create, manage, and track your tasks with ease. Stay productive and never miss a deadline again.
      </p>
      <div className="cta-buttons">
        <Link to="/register" className="cta-button primary">
          Get Started
        </Link>
        <Link to="/login" className="cta-button secondary">
          Sign In
        </Link>
      </div>
      
      <div style={{ marginTop: '3rem', opacity: 0.8 }}>
        <h3 style={{ marginBottom: '1rem' }}>Features</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', maxWidth: '800px' }}>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
            <h4>Easy Task Creation</h4>
            <p>Create tasks quickly with titles and descriptions</p>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <h4>Track Progress</h4>
            <p>Mark tasks as complete and track your productivity</p>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
            <h4>Secure & Private</h4>
            <p>Your tasks are private and securely stored</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;