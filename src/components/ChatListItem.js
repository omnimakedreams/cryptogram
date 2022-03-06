import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Pressable, Image} from 'react-native';
import {useMainContext} from '../context/AppContext';
import {useChatListContext} from '../context/ChatListContext';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Icon2 from 'react-native-vector-icons/dist/SimpleLineIcons';
import moment from 'moment';
require('moment/locale/es.js');
const ChatListItem = ({chatItem, setParamsChat}) => {
  const context = useMainContext();
  const {
    theme,
    session,
    setActiveChatData,
    setActualChatMessages,
    actualChatMessages,
    contacts,
    setLoading,
  } = context;
  const context2 = useChatListContext();
  const {vista, toggleVista} = context2;
  let counter = chatItem.messages.reduce((acc, msj) => {
    if (msj.status == 'received' && msj.created_by != session.id_user) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);
  const openChat = () => {
    const indexToUpdate = contacts.findIndex(
      con => con.id_user == chatItem.id_contact,
    );
    if (indexToUpdate != -1) {
      setActiveChatData({
        ...contacts[indexToUpdate],
        id_chat: chatItem.id_chat,
        online: chatItem.online,
        title: chatItem.title,
        type: chatItem.type,
      });
      toggleVista('oneChat');
      setParamsChat({
        id: chatItem.id_contact,
        type: 'old'
      });
    } else {
      setActiveChatData(null);
    }
    let aNuevo = chatItem.messages.slice(-13)
    setActualChatMessages(aNuevo);
  };
  return (
    <Pressable
      style={styles.chatItem(theme, counter!=0)}
      onPressIn={() => openChat()}>
      <View style={styles.chatDiv0}>
        <Image
          style={styles.avatar(theme, counter!=0)}
          source={{
            uri: chatItem.thumbLocal ? chatItem.thumbLocal : chatItem.thumb,
          }}
        />
        {chatItem.online == 'online' ? (
          <View style={styles.spanOnline(theme)}></View>
        ) : (
          false
        )}
      </View>
      <View style={styles.chatMainDiv}>
        <View style={styles.chatDivTitle}>
          <View style={styles.chatSubDiv1}>
            <Text numberOfLines={1} style={styles.title(theme, counter!=0)}>
              {chatItem.title}
            </Text>
          </View>
          <View style={styles.chatSubDiv2}>
            <Text numberOfLines={1} style={styles.timeText(theme, counter!=0)}>
              {moment(
                chatItem.messages[chatItem.messages.length - 1].date,
              ).format('L')}
            </Text>
            <Text numberOfLines={1} style={styles.timeText(theme, counter!=0)}>
              {moment(
                chatItem.messages[chatItem.messages.length - 1].date,
              ).format('h:mm a')}
            </Text>
          </View>
        </View>
        <View style={styles.chatDiv}>
          <View style={styles.chatsubDiv1}>
            {chatItem.messages[chatItem.messages.length - 1].created_by ==
            session.id_user ? (
              chatItem.messages[chatItem.messages.length - 1].status ==
              'sending' ? (
                <Icon2 name="clock" color="#e0e0e0" size={15} />
              ) : chatItem.messages[chatItem.messages.length - 1].status ==
                'sent' ? (
                <Icon name="checkmark" color="#e0e0e0" size={15} />
              ) : (
                <Icon
                  name="checkmark-done"
                  color={
                    chatItem.messages[chatItem.messages.length - 1].status ==
                    'viewed'
                      ? '#0080ff'
                      : '#fff'
                  }
                  size={15}
                />
              )
            ) : (
              false
            )}
            {chatItem.messages[chatItem.messages.length - 1].message.length >
            30 ? (
              <Text
                numberOfLines={1}
                style={styles.messageText(theme, counter != 0)}>
                {chatItem.messages[
                  chatItem.messages.length - 1
                ].message.substring(0, 30) + '...'}
              </Text>
            ) : (
              <Text
                numberOfLines={1}
                style={styles.messageText(theme, counter != 0)}>
                {chatItem.messages[
                  chatItem.messages.length - 1
                ].message.substring(0, 30)}
              </Text>
            )}
          </View>
          <View style={styles.chatsubDiv2}>
            {counter != 0 ? (
              <View style={styles.span(theme)}>
                <Text numberOfLines={1} style={styles.counterText(theme)}>
                  {counter <= 99 ? counter : 99}
                </Text>
              </View>
            ) : (
              false
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 5,
  },
  chatItem: (theme, newChat) => ({
    backgroundColor: newChat? theme.primary : '#fff',
    borderColor:  newChat? '#fff' : theme.primary,
    borderWidth: 1,
    maxWidth: '98%',
    minWidth: '98%',
    height: 90,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    marginBottom: 5,
  }),
  avatar: (theme, newChat) => ({
    borderRadius: 100,
    width: 70,
    height: 70,
    borderColor: newChat ? '#fff': theme.secondary,
    borderWidth: 1,
  }),
  chatMainDiv: {
    width: '82%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  chatDiv0: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '18%',
  },
  chatDiv: {
    width: '100%',
    paddingLeft: 5,
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  chatsubDiv1: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  chatsubDiv2: {
    width: '10%',
  },
  chatDiv2: {
    width: '20%',
    justifyContent: 'flex-end',
  },
  messageText: (theme, newChat) => ({
    color: newChat ? '#fff' : theme.primary,
    textAlign: 'left',
    flex: 1,
    alignItems: 'flex-start',
  }),
  timeText: (theme, newChat) => ({
    textAlign: 'right',
    color: newChat? '#fff' : theme.primary,
    fontSize: 9,
    fontWeight: 'bold',
  }),
  chatDivTitle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingRight: 5,
    paddingLeft: 5,
  },
  chatSubDiv1: {
    width: '80%',
    paddingLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  chatSubDiv2: {
    width: '25%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  title: (theme, newChat) => ({
    color: newChat?'#fff':theme.primary,
    fontSize: 18,
    fontWeight: 'bold',
  }),
  span: theme => ({
    backgroundColor: theme.terteary,
    borderRadius: 50,
    padding: 3,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  spanOnline: theme => ({
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.success,
    height: 15,
    width: 15,
    borderRadius: 50,
  }),
  counterText: theme => ({
    color: theme.primaryLight,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
  }),
});
export default ChatListItem;
