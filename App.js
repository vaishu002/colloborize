import React from 'react';
import Chat from './Chat';
import './App.css';
import Header from './header';
import Sidebar from './Sidebar'; // Corrected the import statement
import SidebarOption from "./SidebarOption";
import styled from 'styled-components';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './Login';

function App() {
  const [user, loading] = useAuthState(auth);
  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <Router>
          <div>
            <Header />
            <AppBody>
              <Sidebar />
              <SidebarOption />

              <Switch>
                <Route path="/" exact>
                  <Chat />
                </Route>
              </Switch>
            </AppBody>
          </div>
        </Router>
      )}
    </div>
  );
}

export default App;

const AppBody = styled.div`
  display: flex;
  height: 100vh;
`;
