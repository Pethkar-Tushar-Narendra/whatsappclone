import React, { useContext } from 'react';
import { Store } from '../../Store';
import './HomePage.css';
import UserList from './UserList/UserList';
const HomePage = () => {
  const { dispatch: ctxDispatch } = useContext(Store);
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('whatsAppUserInfo');
  };
  return (
    <div className="homepage-container">
      <div className="chatBox">
        <UserList />
        <button className="btn signout-btn" onClick={signoutHandler}>
          Signout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
