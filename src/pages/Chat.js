import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useMainContext} from '../context/AppContext';
import {useChatListContext} from '../context/ChatListContext';
import Loader from '../components/Loader';
import InputEntry from '../components/InputEntry';
import {localBackground, access} from '../commons/variables';
import Message from '../components/Message';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {socket} from '../services/Socket';
import moment from 'moment';
import {createIconSetFromFontello} from 'react-native-vector-icons';
require('moment/locale/es.js');

const Chat = ({type, id, setParamsChat}) => {
  const context2 = useChatListContext();
  const {vista, chatLoader, page, setPage} = context2;
  const context = useMainContext();
  const {
    loading,
    session,
    chatsInMemory,
    setActiveChatData,
    activeChatData,
    theme,
    setActualChatMessages,
    actualChatMessages,
    contacts,
  } = context;

  const [scrollView, setScrollView] = useState(null);
  const [reply, setReply] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const indexTo = chatsInMemory.findIndex(chat => chat.id_contact == id);
    if (indexTo != -1) {
      chatsInMemory[indexTo].messages.map(msj => {
        if (msj.created_by != session.id_user && msj.status == 'received') {
          socket.emit('updateMessageStatusInServer', {
            access: access,
            id_user: session.id_user,
            id_message: msj.id_message,
            status: 'viewed',
          });
        }
      });
      if (type == 'new') {
        let contactInfo = null;
        const indexTo0 = contacts.findIndex(con => con.id_user == id);
        if (indexTo0 != -1) {
          contactInfo = contacts[indexTo0];
        }
        let aNuevo = chatsInMemory[indexTo].messages.slice(-13);
        setActualChatMessages(aNuevo);
        if (contactInfo) {
          setActiveChatData({
            ...contactInfo,
            id_chat: chatsInMemory[indexTo].id_chat,
            online: chatsInMemory[indexTo].online,
            title: chatsInMemory[indexTo].title,
            type: chatsInMemory[indexTo].type,
          });
        }
      }
    }
    return setParamsChat({
      id: null,
      type: 'old',
    });
  }, []);
  useEffect(() => {
    if (reply) {
      scrollToBottom();
    }
  }, [reply]);
  const nextPage = () => {
    let contador = actualChatMessages.length;
    let get = (contador + 12) * -1;
    const indexToFind = chatsInMemory.findIndex(
      cht => cht.id_contact == activeChatData.id_user,
    );
    if (indexToFind != -1) {
      if (chatsInMemory[indexToFind].messages.length > get) {
        let sliced = chatsInMemory[indexToFind].messages.slice(get);
        let vectorNew = [];
        sliced.map(msj => {
          const indexToFind2 = actualChatMessages.findIndex(
            ms => ms.id_message == msj.id_message,
          );
          if (indexToFind2 == -1) {
            vectorNew.push(msj);
          }
        });
        setActualChatMessages(vectorNew.concat(actualChatMessages));
        setPage(page + 1);
      }
    }
  };
  function trySend(msj) {
    let ThisUser = activeChatData;
    let temporal = {
      id_message: 0,
      username: session.username,
      created_by: session.id_user + '',
      imgURL: session.imgURL,
      message: msj,
      status: 'sending',
      date: moment(),
      reply: reply ? reply.id_message : 0,
    };
    let temporal2;
    if (!activeChatData.id_chat) {
      temporal2 = temporal;
      temporal2.id_contact = ThisUser.id_user;
      temporal2.access = access;
      socket.emit('newChat', temporal2);
    } else {
      temporal2 = temporal;
      temporal2.id_chat = activeChatData.id_chat;
      temporal2.access = access;
      socket.emit('addMessage', temporal2);
    }
    delete temporal['access'];
    if (temporal2.id_chat) {
      delete temporal['id_chat'];
    }
    if (temporal2.id_contact) {
      delete temporal['id_contact'];
    }
    setReply(null);
    setActualChatMessages([...actualChatMessages, temporal]);
  }
  const responseTo = (rowKey, rowMap) => {
    const row = rowMap[rowKey];
    setReply(row.props.item);
    scrollToBottom();
  };
  function addmessage() {
    if (message != '') {
      setMessage('');
      trySend(message);
    }
  }
  const HiddenItemWithActions = props => {
    const {data, rowMap} = props;
    return <View></View>;
  };
  const getHeader = () => {
    const indexToFind = chatsInMemory.findIndex(
      cht => cht.id_contact == activeChatData.id_user,
    );
    if (indexToFind != -1) {
      if (
        chatsInMemory[indexToFind].messages.length == actualChatMessages.length
      ) {
        return (
          <View style={styles.separator}>
            <Text>No hay mensajes anteriores</Text>
          </View>
        );
      } else {
        return <ActivityIndicator size="large" color={theme.primary} />;
      }
    } else {
      return false;
    }
  };
  const renderHiddenItem = (data, rowMap) => {
    return <HiddenItemWithActions data={data} rowMap={rowMap} />;
  };
  const scrollToBottom = () => {
    scrollView.scrollToEnd({animated: true});
  };
  const renderItem = ({item, index}) => {
    return <Message data={item} index={index} scrollView={scrollView} />;
  };
  if (vista != 'oneChat') {
    return <></>;
  }
  if (loading || !activeChatData) {
    return <Loader />;
  }
  return (
    <View style={styles.root}>
      {chatLoader ? (
        <View style={styles.chatLoader}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        false
      )}
      <View style={styles.messagesDiv}>
        <ImageBackground
          source={{uri: localBackground}}
          style={{
            flex: 1,
            resizeMode: 'cover',
            width: '100%',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <SwipeListView
            initialNumToRender={13}
            inverted
            refreshing={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={actualChatMessages}
            contentContainerStyle={{
              paddingBottom: 5,
              flexDirection: 'column-reverse',
            }}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={0.1}
            rightOpenValue={0}
            directionalDistanceChangeThreshold={40}
            disableLeftSwipe={true}
            stopLeftSwipe={90}
            keyExtractor={(item, index) => index + ''}
            onRowOpen={responseTo}
            listViewRef={ref => setScrollView(ref)}
            onEndReached={({distanceFromEnd}) => {
              if (distanceFromEnd < 500) {
                nextPage();
              }
            }}
            ListHeaderComponent={() => getHeader()}
          />
        </ImageBackground>
      </View>

      {reply ? (
        <View style={styles.replyRoot}>
          <View style={styles.replyInputDiv}>
            <View style={styles.replyDiv2}>
              <View style={styles.replyDiv3}>
                <View style={styles.replyMessage}>
                  <Text>Respuesta a:</Text>
                  <Text style={styles.reply}>
                    {reply
                      ? reply.message.length > 40
                        ? reply.message.substring(0, 40) + '...'
                        : reply.message.substring(0, 40)
                      : ''}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.iconStyle}
                  onPress={() => {
                    setReply(null);
                  }}>
                  <Icon name="cancel" size={35} color={theme.terteary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : (
        false
      )}
      <InputEntry
        addmessage={addmessage}
        setMessage={setMessage}
        message={message}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  chatLoader: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  messagesDiv: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  scroll: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  loader: {
    marginBottom: 20,
  },
  indicatorDiv: center => ({
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: center ? 'center' : 'flex-end',
  }),
  loaderMessage: right => ({
    textAlign: right ? 'right' : 'left',
    fontSize: 10,
  }),
  iconStyle: {
    marginLeft: 12,
  },
  replyRoot: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 5,
    paddingBottom: 0,
  },
  replyInputDiv: reply => ({
    height: 65,
    width: '90%',
    borderRadius: 10,
    justifyContent: 'flex-start',
    paddingTop: 10,
  }),
  replyDiv2: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    maxWidth: '100%',
    minWidth: '10%',
    minHeight: 30,
  },
  replyDiv3: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  replyMessage: {
    borderRadius: 5,
    flex: 1,
    padding: 10,
    backgroundColor: '#eeeeee',
  },
});
export default Chat;
