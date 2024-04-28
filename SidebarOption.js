import React from 'react';
import styled from 'styled-components';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { enterRoom } from './features/appSlice';

function SidebarOption({ Icon, title, addChannelOption, id }) {
  const dispatch = useDispatch();


  const addSavedItem = async () => {
    try {
      // Add the saved item to the 'saved_items' collection in Firestore
      await addDoc(collection(db, 'saved_items'), {
        title: title, // Add the title of the saved item
        // You can add more fields here as needed
      });
      console.log('Saved item added successfully');
    } catch (error) {
      console.error('Error adding saved item:', error);
    }
  };

  const addChannel = async () => {
    const channelName = prompt('Please add a Channel');

    if (channelName) {
      try {
        const docRef = await addDoc(collection(db, 'rooms'), {
          name: channelName,
        });
        console.log('Document written with ID: ', docRef.id);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    }
  };

  const selectChannel = () => {
    if (id) {
      dispatch(enterRoom({ roomId: id }));
    }
  };

  return (
    <SidebarOptionContainer onClick={addChannelOption ? addChannel : selectChannel}>
      {Icon && <Icon fontSize="small" style={{ padding: 10 }} />}
      {Icon ? (
        <h3>{title}</h3>
      ) : (
        <SidebarOptionChannel>
          <span></span> {title}
        </SidebarOptionChannel>
      )}
    </SidebarOptionContainer>
  );
}

export default SidebarOption;

const SidebarOptionContainer = styled.div`
  display: flex;
  font-size: 12px;
  align-items: center;
  padding-left: 2px;
  cursor: pointer;

  :hover {
    opacity: 0.9;
    background-color: #340e36;
  }
`;

const SidebarOptionChannel = styled.h3`
  display: flex;
  font-size: 12px;
  align-items: center;
  padding-left: 45px;
  cursor: pointer;

  :hover {
    opacity: 0.9;
    background-color: #340e36;
  }
`;
