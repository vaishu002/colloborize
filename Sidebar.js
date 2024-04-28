import React from 'react';
import styled from 'styled-components';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CreateIcon from '@mui/icons-material/Create';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AppsIcon from '@mui/icons-material/Apps';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SidebarOption from './SidebarOption';
import AddIcon from '@mui/icons-material/Add';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

function Sidebar() {
    const [channels, loading, error] = useCollection(collection(db, 'rooms'));
  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarInfo>
          <h2>Collaborize.io</h2>
          <h3>
            <FiberManualRecordIcon />
            Vaishnavi 
          </h3>
        </SidebarInfo>
        <CreateIcon />
      </SidebarHeader>
      <hr/>
      <SidebarOption Icon={ExpandMoreIcon} title="Channels"/>
      <hr/>
      <SidebarOption Icon={AddIcon} addChannelOption title="Add Channel"/>
      {channels?.docs.map((doc)=>(
        <SidebarOption key={doc.id} id ={doc.id}  title={doc.data().name}/>))}
    </SidebarContainer>
  );
}

const SidebarContainer = styled.div`

  background-color: var(--slack-color);
  color: white;
  height: 100vh;
  width: 250px;
  flex: 0.3;
  border-top: 1px solid #49274b;
  max-width: 260px;
  margin-top: 1px;
`;

const SidebarHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #49274b;
  padding: 13px;

  > .MuiSvgIcon-root {
    padding: 8px;
    color: #49274b;
    font-size: 18px;
    background-color: white;
    border-radius: 999px;
  }
`;

const SidebarInfo = styled.div`
  flex: 1;

  h2 {
    font-size: 15px;
    font-weight: 900;
    margin-bottom: 5px;
  }

  h3 {
    color: white;
    display: flex;
    font-size: 13px;
    font-weight: 400;
    align-items: center;
    margin: 5px;
  }

  > h3 > .MuiSvgIcon-root {
    font-size: 14px;
    margin-top: 1px;
    margin-right: 2px; /* Corrected the typo */
    color: green;
  }
`;

export default Sidebar;
