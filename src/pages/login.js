import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const userData = {
      email: email,
      password: password,
    };
    axios
      .post(`${config.api.baseURL}${config.api.endpoints.login}`, userData)
      .then(response => {
        localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
        setLoading(false);
        navigate('/');
      })
      .catch(error => {
        setErrors(error.response.data);
        setLoading(false);
      });
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '10px' 
          }}>🔐</div>
          <h1 style={{ margin: 0, color: '#333' }}>Login</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold',
              color: '#555'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {errors.email && (
              <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold',
              color: '#555'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {errors.password && (
              <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#3f51b5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <a 
              href="/signup" 
              style={{ 
                color: '#3f51b5', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Don't have an account? Sign Up
            </a>
          </div>

          {errors.general && (
            <div style={{ 
              color: 'red', 
              fontSize: '14px', 
              marginTop: '10px',
              textAlign: 'center'
            }}>
              {errors.general}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;