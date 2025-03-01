import React from 'react';
import styles from './Authentication.module.css';
import { FcGoogle } from 'react-icons/fc';

const GoogleLogin = () => {
  const googleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <button
      type="button"
      className={styles['google-login-button']}
      onClick={googleLogin}
    >
      <FcGoogle className={styles['google-icon']} />
      Continue with Google
    </button>
  );
};

export default GoogleLogin;
