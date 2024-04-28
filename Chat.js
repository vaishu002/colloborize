import React, { useEffect, useState, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { useSelector } from 'react-redux';
import { selectRoomId } from './features/appSlice';
import ChatInput from './ChatInput';
import { collection, doc, getDoc, onSnapshot, orderBy, query, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import Message from './Message';

const lightTheme = {
  background: '#F2F7F2',
  color: '#333',
};

const darkTheme = {
  background: '#333',
  color: '#fff',
};

function Chat() {
  const chatRef = useRef(null);
  const roomId = useSelector(selectRoomId);
  const [roomDetails, setRoomDetails] = useState(null);
  const [roomMessages, setRoomMessages] = useState([]);
  const [theme, setTheme] = useState('light');
  const [pollData, setPollData] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (roomId) {
        const roomDoc = await getDoc(doc(db, 'rooms', roomId));
        setRoomDetails(roomDoc.data());
      }
    };

    const messagesQuery = roomId
      ? query(collection(db, 'rooms', roomId, 'messages'), orderBy('timestamp', 'asc'))
      : null;

    const unsubscribeMessages = messagesQuery
      ? onSnapshot(messagesQuery, (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setRoomMessages(messages);
        })
      : null;

    fetchRoomDetails();

    return () => {
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    };
  }, [roomId]);

  useEffect(() => {
    chatRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  const handleCreatePoll = async (question, options) => {
    try {
      const newPollRef = doc(collection(db, 'polls'));
      const newPollDoc = {
        question,
        options,
        roomId,
      };
      await addDoc(newPollRef, newPollDoc);
      console.log('Poll created successfully');
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <ChatContainer>
        <>
          <Header>
            <HeaderLeft>
              <h4>
                <strong>#{roomDetails?.name}</strong>
              </h4>
              <StarBorderOutlinedIcon />
            </HeaderLeft>
            <HeaderRight>
              <ThemeToggle onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
              </ThemeToggle>
            </HeaderRight>
          </Header>
          <ChatMessage>
            {roomMessages.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                timestamp={message.timestamp}
                user={message.user}
                userImage={message.userImage}
                fileUrl={message.fileUrl}
                messageId={message.id}
              />
            ))}
            {pollData && (
              <PollContainer>
                <h3>{pollData.question}</h3>
                <ul>
                  {pollData.options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              </PollContainer>
            )}
            <ChatBottom ref={chatRef} />
          </ChatMessage>
          <ChatInput
            channelName={roomDetails?.name}
            channelId={roomId}
            onCreatePoll={handleCreatePoll}
          />
        </>
      </ChatContainer>
    </ThemeProvider>
  );
}

const ThemeToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

const ChatMessage = styled.div``;

const ChatBottom = styled.div`
  padding-bottom: 200px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  > h4 {
    display: flex;
    text-transform: lowercase;
    margin-right: 10px;
  }
  > h4 > .MuiSvgIcon-root {
    margin-left: 10px;
    font-size: 18px;
  }
`;

const HeaderRight = styled.div`
  > p {
    display: flex;
    justify-content: space-between;
    margin-right: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid lightgray;
`;

const ChatContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 50px;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
`;

const PollContainer = styled.div`
  position: fixed;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

export default Chat;
