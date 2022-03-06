import React, {useEffect, useState} from 'react';
import Nav from '../components/Nav';
import {ChatListProvider} from '../context/ChatListContext';
const LayoutChatList = ({children}) => {
  return (
    <ChatListProvider>
      <>
        <Nav />
        {children}
      </>
    </ChatListProvider>
  );
};

export default LayoutChatList;
