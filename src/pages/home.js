import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Account from '../components/account';
import Todo from '../components/todo';

import { authMiddleWare } from '../util/auth';
import config from '../config';

function Home() {
  const navigate = useNavigate();
  const [render, setRender] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [uiLoading, setUiLoading] = useState(true);

  const loadAccountPage = () => {
    setRender(true);
  };

  const loadTodoPage = () => {
    setRender(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem('AuthToken');
    navigate('/login');
  };

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
        setUiLoading(false);
        setProfilePicture(response.data.userCredentials.imageUrl);
      })
      .catch(error => {
        if (error.response.status === 403) {
          navigate('/login');
        }
        console.log(error);
      });
  }, [navigate]);

  if (uiLoading === true) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  } else {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ 
          width: '240px', 
          backgroundColor: '#f5f5f5', 
          padding: '20px',
          borderRight: '1px solid #ddd'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img 
              src={profilePicture || '/default-avatar.png'} 
              alt="Profile"
              style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%',
                marginBottom: '10px'
              }}
            />
            <div>
              {firstName} {lastName}
            </div>
          </div>
          
          <nav>
            <div 
              style={{ 
                padding: '10px', 
                cursor: 'pointer', 
                backgroundColor: render ? '#e3f2fd' : 'transparent',
                marginBottom: '5px',
                borderRadius: '4px'
              }}
              onClick={loadTodoPage}
            >
              📝 Todo
            </div>
            <div 
              style={{ 
                padding: '10px', 
                cursor: 'pointer', 
                backgroundColor: !render ? '#e3f2fd' : 'transparent',
                marginBottom: '5px',
                borderRadius: '4px'
              }}
              onClick={loadAccountPage}
            >
              👤 Account
            </div>
            <div 
              style={{ 
                padding: '10px', 
                cursor: 'pointer', 
                color: '#d32f2f',
                marginBottom: '5px',
                borderRadius: '4px'
              }}
              onClick={logoutHandler}
            >
              🚪 Logout
            </div>
          </nav>
        </div>

        <div style={{ flex: 1, padding: '20px' }}>
          {render ? <Account /> : <Todo />}
        </div>
      </div>
    );
  }
}

export default Home;