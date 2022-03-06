import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  BackHandler,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useNavigate} from 'react-router-native';

import {useMainContext} from '../context/AppContext';
import Loader from '../components/Loader';
import UsernameInput from '../components/UsernameInput';
import ChatList from '../components/ChatList';
import ContactsList from '../components/ContactsList';
import LayoutChatList from '../Layouts/LayoutChatList';
import Chat from '../pages/Chat';

const Home = () => {
  let navigate = useNavigate();
  const context = useMainContext();
  const {loading, setLoading, session, backLogin, initSocketMethods, closeSocketMethods} = context;
  const [paramsChat, setParamsChat] = useState({
    id: null,
    type: 'old',
  });
  useEffect(() => {
    if (backLogin) {
      navigate('/');
    }
  }, [backLogin]);
  useEffect(() => {
    initSocketMethods();
    setLoading(false);
  }, []);
  if (loading) {
    return (
      <View style={styles.loader}>
        <Loader />
      </View>
    );
  }
  if (session && !session.username) {
    return <UsernameInput />;
  }
  return (
    <SafeAreaView style={styles.root}>
      <LayoutChatList>
        <Chat id={paramsChat.id} type={paramsChat.type} setParamsChat={setParamsChat} />
        <ChatList setParamsChat={setParamsChat} />
        <ContactsList setParamsChat={setParamsChat} />
      </LayoutChatList>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
export default Home;
