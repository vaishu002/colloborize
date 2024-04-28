import React, { useState } from 'react';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Predefined list of messages
const predefinedMessages = ['hey', 'Hey', 'Hello', 'Hii', 'Pesu', 'Vaishnavi', 'mca'];

function Header() {
  const [user] = useAuthState(auth);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      const messages = searchTerm.split(',').map(msg => msg.trim());
      const found = messages.some(msg => predefinedMessages.includes(msg));

      if (found) {
        alert('Message found');
      } else {
        alert('No messages found');
      }
    } catch (error) {
      console.error('Error searching messages:', error);
    }
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
        <HeaderAvatar onClick={() => auth.signOut()} 
          alt={user?.displayName}
          src={user?.photoURL}
        />
      </HeaderLeft>
      <HeaderSearch>
        <input 
          placeholder="Search" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </HeaderSearch>
      <HeaderRight></HeaderRight>
    </HeaderContainer>
  );
}

export default Header;

const HeaderRight = styled.div``;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #fff; /* Set the color to white */
`;


const HeaderSearch = styled.div`
  flex: 0.4;
  opacity: 1;
  border-radius: 6px;
  text-align: center;
  display: flex;
  padding: 0 50px;
  color: grey;
  border: 1px gray solid;

  > input {
    background-color: transparent;
    border: none;
    text-align: center;
    min-width: 30vw;
    outline: 0;
    color: white;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  background-color: var(--slack-color);
  color: white;
`;

const HeaderLeft = styled.div`
  flex: 0.3;
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const HeaderAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;
