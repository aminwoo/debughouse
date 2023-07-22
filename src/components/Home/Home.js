import React from 'react';
import { Link } from 'react-router-dom';

import './Home.css';
import { socket } from '../../socket';

const Home = () => {
  const [username, setUser] = React.useState('');
  const [password, setPass] = React.useState('');

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };

  const handlePassChange = (event) => {
    setPass(event.target.value);
  };

  const Login_Submit = () => {
    socket.emit('login', `?username=${username}&password=${password}`);
  }

  return (
    <div className='home-container'>
      <input
        type='text'
        placeholder='username'
        value={username}
        onChange={handleUserChange}
        className='text-input-field'
      />
      <input
        type='text'
        placeholder='password'
        value={password}
        onChange={handlePassChange}
        className='text-input-field'
      />
      <button onClick = {Login_Submit}>
        <Link to={'/play'}>
            <div className='login-element'>
              Login
            </div>
          </Link>
      </button>
    </div>
  );
};

export default Home;