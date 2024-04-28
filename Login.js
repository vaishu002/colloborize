import React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

function Login() {
  const signIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <LoginContainer>
      <LoginInnerContainer>
        <h1>Sign in to Collaborize</h1>
        <SignInButton onClick={signIn}>
          Sign in with Google
        </SignInButton>
      </LoginInnerContainer>
    </LoginContainer>
  );
}

export default Login;

const LoginContainer = styled.div`
  background-image: url('https://media3.giphy.com/headers/slack/5ZlqmdYOTjKb.png');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const LoginInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > img {
    object-fit: contain;
    height: 100px;
    margin-bottom: 17px;
    margin-right: 8px; /* Adjust this value as needed */
  }

  > h1 {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
    color: white; /* Adjust text color as needed */
  }
`;

const SignInButton = styled(Button)`
  margin-top: 50px;
  text-transform: inherit !important;
  background-color: #0a8d48 !important;
  color: white;

  &:hover {
    background-color: #075e32 !important; /* Change the color for the hover effect */
  }
`;
