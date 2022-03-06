import React, {createContext, useState, useEffect, useContext} from 'react';
import {
  BackHandler,
} from 'react-native';
const CListContext = createContext();
export const useChatListContext = () => useContext(CListContext);
export const ChatListProvider = ({children}) => {
  const [vista, setVista] = useState('chats');
  const [chatLoader, setChatLoader] = useState(false);
  const [page, setPage] = useState(1);
  const toggleVista= dat => {
    setVista(dat);
  };
  useEffect(() => {
    if(vista=='oneChat'){
      setPage(1);
    }
  }, [vista])
  useEffect(() => {
    const backAction = () => {
      if (vista != 'chats') {
        toggleVista('chats');
      } else {
        BackHandler.exitApp();
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  return (
    <CListContext.Provider value={{vista, toggleVista, chatLoader, setChatLoader, page, setPage}}>
      {children}
    </CListContext.Provider>
  );
};
