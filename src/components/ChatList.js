import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useMainContext} from '../context/AppContext';
import {useChatListContext} from '../context/ChatListContext';
import {multimediaURL} from '../commons/variables';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import ChatListItem from './ChatListItem';
import Nav from '../components/Nav'
const ChatList = ({setParamsChat}) => {
  const context = useMainContext();
  const {theme, session, chatsInMemory, setLoading} = context;
  const context2 = useChatListContext();
  const {vista, toggleVista} = context2;
  const iniciarChat = () => {
    toggleVista('addChat');
  };
  useEffect(() => {
    setLoading(false);
  }, []);
  if(vista!='chats'){
    return <></>
  }
  return (
      <View style={styles.root0}>
        {chatsInMemory && session ? (
          <ScrollView contentContainerStyle={styles.root}>
            {chatsInMemory.length != 0 ? (
              <View style={styles.indicatorDiv(false)}>
                {chatsInMemory.map((chat, i) => (
                  <ChatListItem
                    chatItem={chat}
                    key={i}
                    setParamsChat={setParamsChat}
                  />
                ))}

                {chatsInMemory.length > 10 ? (
                  <View style={styles.indicatorDiv(false)}>
                    <ActivityIndicator
                      size="large"
                      color={theme.primary}
                      style={styles.loader}
                    />
                    <Text numberOfLines={1} style={styles.loaderMessage(true)}>
                      Cargando conversaciones
                    </Text>
                  </View>
                ) : (
                  false
                )}
              </View>
            ) : (
              <View style={styles.indicatorDiv(true)}>
                <Text numberOfLines={1} style={styles.loaderMessage(true)}>
                  No hay chats registrados
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View style={styles.root1}>
            <ActivityIndicator
              size="large"
              color={theme.primary}
              style={styles.loader}
            />
            <Text numberOfLines={1} style={styles.loaderMessage(true)}>
              Cargando conversaciones
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.fabButton(theme)} onPress={iniciarChat}>
          <Icon name="plus" size={30} color={'#fff'} />
        </TouchableOpacity>
      </View>
  );
};
const styles = StyleSheet.create({
  root0: {
    flex: 1,
    width: '100%',
  },
  root1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherRoot:{
    flex: 1,
  },
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  fabButton: theme => ({
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    right: 10,
    height: 70,
    bottom: 20,
    backgroundColor: theme.primary,
    borderRadius: 100,
  }),
  loader: {
    marginBottom: 20,
  },
  indicatorDiv: center => ({
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    justifyContent: center ? 'center' : 'flex-start',
  }),
  loaderMessage: right => ({
    textAlign: right ? 'right' : 'left',
    fontSize: 12,
  }),
});
export default ChatList;
