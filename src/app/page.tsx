'use client';

import { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored token on page load
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('authToken', data.token);
      } else {
        const error = await response.json();
        alert(error.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('authToken', data.token);
      } else {
        const error = await response.json();
        alert(error.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };

  if (token) {
    return <Dashboard token={token} onLogout={handleLogout} />;
  }

  return (
    <AuthForm
      onLogin={handleLogin}
      onRegister={handleRegister}
      loading={loading}
    />
  );
}