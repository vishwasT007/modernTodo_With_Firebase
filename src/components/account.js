import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import config from '../config';

function Account() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  // const [profilePicture] = useState('');
  const [uiLoading, setUiLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    authMiddleWare(navigate);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get(`${config.api.baseURL}${config.api.endpoints.user}`)
      .then(response => {
        console.log(response.data);
        setFirstName(response.data.userCredentials.firstName);
        setLastName(response.data.userCredentials.lastName);
        setEmail(response.data.userCredentials.email);
        setPhoneNumber(response.data.userCredentials.phoneNumber);
        setCountry(response.data.userCredentials.country);
        setUsername(response.data.userCredentials.username);
        setUiLoading(false);
      })
      .catch(error => {
        if (error.response.status === 403) {
          navigate('/login');
        }
        console.log(error);
      });
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'country':
        setCountry(value);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (event) => {
    setImageError('');
    // Handle image change if needed
  };

  const profilePictureHandler = (event) => {
    event.preventDefault();
    setUiLoading(true);
    authMiddleWare(navigate);
    const authToken = localStorage.getItem('AuthToken');
    let form_data = new FormData();
    // Add image handling logic here
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .post(
        `${config.api.baseURL}${config.api.endpoints.user}/image`,
        form_data,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
      )
      .then(() => {
        window.location.reload();
      })
      .catch(error => {
        if (error.response.status === 403) {
          navigate('/login');
        }
        console.log(error);
        setUiLoading(false);
        setImageError('Error in posting the data');
      });
  };

  const updateFormValues = (event) => {
    event.preventDefault();
    setButtonLoading(true);
    authMiddleWare(navigate);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    const formRequest = {
      firstName: firstName,
      lastName: lastName,
      country: country,
    };
    axios
      .post(`${config.api.baseURL}${config.api.endpoints.user}`, formRequest)
      .then(() => {
        setButtonLoading(false);
        alert('Profile updated successfully!');
      })
      .catch(error => {
        if (error.response.status === 403) {
          navigate('/login');
        }
        console.log(error);
        setButtonLoading(false);
      });
  };

  if (uiLoading === true) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Loading account...</div>
      </div>
    );
  } else {
    return (
      <div>
        {/* Profile Picture Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
            {firstName} {lastName}
          </h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: 'bold',
              color: '#555'
            }}>
              Profile Picture
            </label>
            <input 
              type="file" 
              onChange={handleImageChange}
              accept="image/*"
              style={{ marginBottom: '10px' }}
            />
            <button
              onClick={profilePictureHandler}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3f51b5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              Upload Photo
            </button>
          </div>

          {imageError && (
            <div style={{ 
              color: 'red', 
              fontSize: '14px', 
              marginTop: '10px' 
            }}>
              Wrong Image Format || Supported Format are PNG and JPG
            </div>
          )}
        </div>

        {/* Account Details Form */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Account Details</h3>
          
          <form onSubmit={updateFormValues}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px',
              marginBottom: '20px'
            }}>
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

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px', 
                  fontWeight: 'bold',
                  color: '#555'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f5f5f5',
                    color: '#666'
                  }}
                />
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
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f5f5f5',
                    color: '#666'
                  }}
                />
              </div>

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
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f5f5f5',
                    color: '#666'
                  }}
                />
              </div>

              <div>
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
                buttonLoading ||
                !firstName ||
                !lastName ||
                !country
              }
              style={{
                padding: '12px 24px',
                backgroundColor: buttonLoading ? '#ccc' : '#3f51b5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: buttonLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {buttonLoading ? 'Saving...' : 'Save Details'}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Account;