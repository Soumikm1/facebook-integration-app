// NOT USED IN THE PROJECT

import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';

const FacebookLoginComponent = ({ onLogin }) => {
  const responseFacebook = (response) => {
    if (response.accessToken) {
      onLogin(response);
    }
  };

  return (
    <FacebookLogin
      appId="YOUR_APP_ID"
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
    />
  );
};

export default FacebookLoginComponent;