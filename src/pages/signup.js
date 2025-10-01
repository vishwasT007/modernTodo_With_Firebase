import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
      case 'country':
        setCountry(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const newUserData = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      country: country,
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
    axios
      .post(`${config.api.baseURL}${config.api.endpoints.signup}`, newUserData)
      .then(response => {
        localStorage.setItem('AuthToken', `${response.data.token}`);
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
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '10px' 
          }}>🔐</div>
          <h1 style={{ margin: 0, color: '#333' }}>Sign Up</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: '#555'
              }}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={firstName}
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
              {errors.firstName && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                  {errors.firstName}
                </div>
              )}
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: '#555'
              }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={lastName}
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
              {errors.lastName && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: '#555'
              }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={username}
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
              {errors.username && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                  {errors.username}
                </div>
              )}
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: '#555'
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
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
              {errors.phoneNumber && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                  {errors.phoneNumber}
                </div>
              )}
            </div>
          </div>

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
              Country
            </label>
            <input
              type="text"
              name="country"
              value={country}
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
            {errors.country && (
              <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                {errors.country}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
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

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: '#555'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
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
            </div>
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !email ||
              !password ||
              !firstName ||
              !lastName ||
              !country ||
              !username ||
              !phoneNumber
            }
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
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <a 
              href="/login" 
              style={{ 
                color: '#3f51b5', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;