import React, { useState } from 'react';
import styled from 'styled-components';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useDispatch } from 'react-redux';
import { enterRoom } from './features/appSlice';
import axios from 'axios';

function Message({ message, timestamp, user, userImage, fileUrl, messageId }) {
  const formattedTimestamp = timestamp
    ? new Date(timestamp.toDate()).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      })
    : '';

  const [reactions, setReactions] = useState([]);
  const [surveyResponse, setSurveyResponse] = useState(''); // State to hold the survey response
  const dispatch = useDispatch();
  const [translatedMessage, setTranslatedMessage] = useState('');
  const translateMessage = async () => {
    try {
      // Make HTTP POST request to Google Translate API
      const response = await axios.post(
        'https://translation.googleapis.com/language/translate/v2',
        null,
        {
          params: {
            q: message,
            target: 'hi', // Target language code (Hindi)
            key: 'YOUR_API_KEY', // Replace with your Google Translate API key
          },
        }
      );

      // Extract translated text from API response
      const translatedText = response.data.data.translations[0].translatedText;

      // Update component state with translated message
      setTranslatedMessage(translatedText);
    } catch (error) {
      console.error('Error translating message:', error);
    }
  };

  const addReaction = (reaction) => {
    setReactions((prevReactions) => [...prevReactions, reaction]);
  };

  const saveMessage = async () => {
    try {
      if (!messageId) {
        console.error('Error saving message: messageId is undefined');
        return;
      }

      await addDoc(collection(db, 'savedItems'), {
        messageId: messageId,
      });
      console.log('Message saved to "saved items"');
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handlePollResponse = (option) => {
    // Implement logic to handle poll response
    console.log(`User selected option: ${option}`);
  };

  const handleSurveyResponse = () => {
    // Implement logic to handle survey response
    console.log(`User submitted survey response: ${surveyResponse}`);
    // Clear the survey response input field after submission
    setSurveyResponse('');
  };

  const isPoll = message.startsWith('[POLL]');
  const isSurvey = message.startsWith('[SURVEY]');

  return (
    <MessageContainer>
      <img src={userImage} alt="" />
      <MessageInfo>
        <h4>
          {user}
          <span>{formattedTimestamp}</span>
        </h4>
        {fileUrl ? (
          <FileMessage>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" >Click it to view the file</a>
          </FileMessage>
        ) : (
          <>
            {isPoll && (
              <PollContainer>
                <PollQuestion>{message.substring(6)}</PollQuestion>
                <PollOptions>
                  <button onClick={() => handlePollResponse('Option 1')}>Option 1</button>
                  <button onClick={() => handlePollResponse('Option 2')}>Option 2</button>
                  <button onClick={() => handlePollResponse('Option 3')}>Option 3</button>
                </PollOptions>
              </PollContainer>
            )}
            {isSurvey && (
              <SurveyContainer>
                <SurveyPrompt>{message.substring(8)}</SurveyPrompt>
                <SurveyInput
                  type="text"
                  placeholder="Enter your response..."
                  value={surveyResponse}
                  onChange={(e) => setSurveyResponse(e.target.value)} // Update survey response state
                />
                <SurveySubmitButton onClick={handleSurveyResponse}>Submit</SurveySubmitButton>
              </SurveyContainer>
            )}
            {!isPoll && !isSurvey && <MessageBox>{message}</MessageBox>}
          </>
        )}
        {reactions.length > 0 && (
          <ReactionsContainer>
            {reactions.map((reaction, index) => (
              <span key={index}>{reaction}</span>
            ))}
          </ReactionsContainer>
        )}
        <InteractionButtons>
          <button onClick={saveMessage}>Save</button>
          <button onClick={() => addReaction('👍')}>👍</button>
          <button onClick={() => addReaction('❤️')}>❤️</button>
        </InteractionButtons>
      </MessageInfo>
    </MessageContainer>
  );
}

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;

  > img {
    height: 50px;
    width: 50px;
    border-radius: 8px;
    margin-right: 10px;
  }
`;

const MessageInfo = styled.div`
  padding-left: 10px;
  background-color: #D9CAB3;
  border-radius: 8px;
`;

const MessageBox = styled.p`
  color: black;
  padding: 10px;
`;

const FileMessage = styled.div`
  margin-top: 5px;
  a {
    color: #443850;
    cursor: pointer;
    max-width: 300px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ReactionsContainer = styled.div`
  margin-left: 5px;
  span {
    margin-right: 5px;
  }
`;

const InteractionButtons = styled.div`
  margin-top: 5px;
  button {
    background: none;
    border: none;
    cursor: pointer;
    margin-right: 5px;
    font-size: 14px;
  }
`;

const PollContainer = styled.div`
  margin-top: 10px;
`;

const PollQuestion = styled.p`
  font-weight: bold;
`;

const PollOptions = styled.div`
  display: flex;
  flex-direction: column;

  button {
    margin-top: 5px;
  }
`;

const SurveyContainer = styled.div`
  margin-top: 10px;
`;

const SurveyPrompt = styled.p`
  font-weight: bold;
`;

const SurveyInput = styled.input`
  margin-top: 5px;
  padding: 5px;
`;

const SurveySubmitButton = styled.button`
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export default Message;
