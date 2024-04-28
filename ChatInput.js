import React, { useState } from 'react';
import styled from 'styled-components';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from './firebase'; // Assuming you have initialized storage in your firebase.js
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faHeart, faLaugh, faThumbsUp, faTired, faGrin } from '@fortawesome/free-solid-svg-icons';

const storageInstance = getStorage();

const ChatInput = ({ channelName, channelId, chatRef }) => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null); // State to store the selected file
  const [user] = useAuthState(auth);
  const [fileUrl, setFileUrl] = useState(null); // State to store the file URL
  const [pollTopic, setPollTopic] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '', '', '']);

  const sendMessage = async (messageToSend) => {
    try {
      if (channelId && (messageToSend.trim() !== '' || file)) {
        let uploadedFileUrl = null;
  
        if (file) {
          const storageRef = ref(storageInstance, `files/${file.name}`);
          await uploadBytes(storageRef, file);
          uploadedFileUrl = await getDownloadURL(storageRef);
          console.log(uploadedFileUrl);
          setFileUrl(uploadedFileUrl); // Update the file URL state
        }
  
        const messageData = {
          message: messageToSend, // Use the provided message content
          timestamp: serverTimestamp(),
          user: user.displayName,
          userImage: user.photoURL,
          fileUrl: uploadedFileUrl,

           // Send the file URL along with the message data
        };
  
        await addDoc(collection(db, 'rooms', channelId, 'messages'), messageData);
  
        setInput('');
        setFile(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  
          const messageData = {
            message: `Shared location: ${locationUrl}`, // Include the location URL in the message
            timestamp: serverTimestamp(),
            user: user.displayName,
            userImage: user.photoURL,
          };
  
          try {
            await addDoc(collection(db, 'rooms', channelId, 'messages'), messageData);
            console.log('Location shared successfully');
          } catch (error) {
            console.error('Error sharing location:', error);
          }
        },
        (error) => console.error('Error getting location:', error)
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleEmojiClick = (emoji) => {
    setInput(input + emoji);
  };

  const handleQuickReply = (message) => {
    setInput(message);
  };

  const handlePollTopicChange = (e) => {
    setPollTopic(e.target.value);
  };

  const handlePollOptionChange = (index, value) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const handleCreatePoll = () => {
    const pollData = {
      topic: pollTopic,
      options: pollOptions.filter(option => option.trim() !== ''),
    };
    // Add logic to send the poll data to the database or display it in the chat
    console.log('Poll created:', pollData);
    // Clear poll inputs
    setPollTopic('');
    setPollOptions(['', '', '', '']);
  };

  return (
    <ChatInputContainer>
      <form onSubmit={(e) => {
        e.preventDefault();
        sendMessage(input);
      }}>
        <MessageContainer>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message #${channelName}`}
          />
          <button type="submit">Send</button>
        </MessageContainer>
        <FileInputContainer>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </FileInputContainer>
      </form>
      <EmojiContainer>
        <EmojiIcon icon={faSmile} onClick={() => handleEmojiClick('😊')} />
        <EmojiIcon icon={faHeart} onClick={() => handleEmojiClick('❤️')} />
        <EmojiIcon icon={faLaugh} onClick={() => handleEmojiClick('😂')} />
        <EmojiIcon icon={faThumbsUp} onClick={() => handleEmojiClick('👍')} />
        <EmojiIcon icon={faTired} onClick={() => handleEmojiClick('😴')} />
        <EmojiIcon icon={faGrin} onClick={() => handleEmojiClick('😁')} />
      </EmojiContainer>
      <QuickReplyContainer>
        <QuickReplyButton onClick={() => handleQuickReply('Hello')}>Hello</QuickReplyButton>
        <QuickReplyButton onClick={() => handleQuickReply('Thanks')}>Thanks</QuickReplyButton>
        <QuickReplyButton onClick={() => handleQuickReply('How are you')}>How are you</QuickReplyButton>
      </QuickReplyContainer>
      <LocationButton onClick={shareLocation}>Share Location</LocationButton>
    </ChatInputContainer>
  );
};



const ChatInputContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
  border-top: 1px solid #ccc;
  display: flex;
  flex-direction: column;
`;

const QuickReplyContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const QuickReplyButton = styled.button`
  background-color: #007bff;
  color: #BC8034;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  width: 60%;
  padding-right: 10px;

  > input {
    flex: 1;
    border: 1px solid gray;
    border-radius: 3px;
    padding: 10px;
    outline: none;
  }

  > button {
    margin-left: 10px;
  }
`;

const FileInputContainer = styled.div`
  margin-top: 10px;
`;

const EmojiContainer = styled.div`
  margin-top: 10px;
  display: flex;
`;

const EmojiIcon = styled(FontAwesomeIcon)`
  font-size: 24px;
  color: #BC8034;
  cursor: pointer;
  margin-right: 10px;
`;

const LocationButton = styled.button`
  margin-top: 10px;
  background-color: #007bff;
  color: #BCAF9C;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  border-radius: 4px;
  width: 80px;
`;

const PollContainer = styled.div`
position: fixed;
top: calc(100px + 20px); /* Height of the navbar + additional spacing */
right: 20px; /* Adjust as needed */
background-color: white;
padding: 20px;
border-radius: 5px;
box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
z-index: 1000;

  > h3 {
    margin-bottom: 10px;
  }

  > input {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  > button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
`;

export default ChatInput;
