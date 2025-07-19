import React, { useState, useEffect, type JSX } from 'react';
import axios from 'axios';

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus = ({ className = '' }: ConnectionStatusProps): JSX.Element => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    try {
      setStatus('checking');
      const response = await axios.get('/api/auth/profile', { timeout: 5000 });
      setStatus('connected');
      setLastChecked(new Date());
    } catch (error) {
      // Try a simple health check endpoint
      try {
        await axios.get('/api/health', { timeout: 5000 });
        setStatus('connected');
      } catch {
        setStatus('disconnected');
      }
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return '🔄 Checking connection...';
      case 'connected':
        return '✅ Backend Connected';
      case 'disconnected':
        return '❌ Backend Disconnected';
      default:
        return 'Unknown status';
    }
  };

  const getStatusClass = () => {
    return `connection-status ${status} ${className}`;
  };

  return (
    <div className={getStatusClass()} onClick={checkConnection} style={{ cursor: 'pointer' }}>
      {getStatusText()}
      {lastChecked && (
        <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.2rem' }}>
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;