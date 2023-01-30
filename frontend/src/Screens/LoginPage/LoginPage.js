import React, { useContext, useState } from 'react';
import { Store } from '../../Store';
import './LoginPag.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const navigate = useNavigate();
  const { dispatch: ctxDispatch } = useContext(Store);
  const [loginToggle, setLoginToggle] = useState(true);
  const [password, setPassword] = useState('');
  const [signUpMobNo, setSignUpMobNo] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginMobNo, setLoginMobNo] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/login', {
        mobNo: loginMobNo,
        password: loginPass,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('whatsAppUserInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  const signUpSubmit = async (e) => {
    e.preventDefault();
    console.log('password', password, ' ', 'Cpassword', confirmPassword);
    if (password !== confirmPassword) {
      window.alert('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.post('/api/signup', {
        signUpMobNo,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('whatsAppUserInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  return (
    <div className="loginpage-container">
      <div className="loginBox">
        {loginToggle ? (
          <form className="loginForm" onSubmit={loginSubmit}>
            <h3 className="title">Login Form</h3>
            <div className="input">
              <h4>Mobile No</h4>
              <input
                type="number"
                placeholder="Mobile No."
                value={loginMobNo}
                onChange={(e) => {
                  setLoginMobNo(e.target.value);
                }}
              />
            </div>
            <div className="input">
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={(e) => {
                  setLoginPass(e.target.value);
                }}
              />
            </div>
            <button type="submit" className="btn">
              Submit
            </button>
            <p>
              If you want to signup{' '}
              <button
                onClick={() => {
                  setLoginToggle(false);
                }}
                className="btn"
              >
                Click
              </button>
            </p>
          </form>
        ) : (
          <form className="loginForm" onSubmit={signUpSubmit}>
            <h3 className="title">SignUp Form</h3>
            <div className="input">
              <h4>Mobile No</h4>
              <input
                type="number"
                placeholder="Mobile No"
                value={signUpMobNo}
                onChange={(e) => {
                  setSignUpMobNo(e.target.value);
                }}
              />
            </div>
            <div className="input">
              <h4>Password</h4>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="input">
              <h4>Confirm Password</h4>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
            <button type="submit" className="btn">
              Submit
            </button>
            <p>
              If you want to login{' '}
              <button
                onClick={() => {
                  setLoginToggle(true);
                }}
                className="btn"
              >
                Click
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
