import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {getData, setData, removeData} from '../services/storage';

import {Alert} from 'react-native';
import Contacts from 'react-native-contacts';
import axios from 'axios';
import PushNotification, {Importance} from 'react-native-push-notification';
import {ServerURL, access} from '../commons/variables';
const MainContext = createContext();
export const useMainContext = () => useContext(MainContext);
import {downloadAssetsFile} from '../services/fs';
import {NotifyNewMessage} from '../services/Notifications';
import {socket} from '../services/Socket';
import moment from 'moment';
import {createIconSetFromFontello} from 'react-native-vector-icons';
require('moment/locale/es.js');
PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    // (required) Called when a remote is received or opened, or local notification is opened
    PushNotification.cancelLocalNotification(notification.id);
    // PushNotification.cancelAllLocalNotifications()
  },
  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
    // process the action
  },
  permissions: {alert: true, badge: true, sound: true},
  popInitialNotification: true,
  requestPermissions: true,
});
PushNotification.createChannel(
  {
    channelId: 'newMessage', // (required)
    channelName: 'Mensajería', // (required)
    channelDescription: 'Recepción de mensajería', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'android.resource://com.ascendapp/raw/ding', // (optional) See `soundName` parameter of `localNotification` function
    priority: 4,
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

//Declarar la zona de contexto:
export const MainProvider = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [backLogin, setBackLogin] = useState(false);
  const [session, setSession] = useState(null);
  let sessionRef = useRef(session);
  let chatsInMemoryRef = useRef(chatsInMemory);
  const [visiblePopMenu, setVisiblePopMenu] = useState(false);
  const [FCMtoken, setFCMToken] = useState(null);
  // Contactos (vista desde lista de contactos)
  const [contacts, setContacts] = useState(null);
  // Datos del chat activo. Objeto con datos del contacto (temporal)
  const [activeChatData, setActiveChatData] = useState(null);
  let activeChatDataRef = useRef(activeChatData);
  // vector de chats de carga rápida, solo contiene chats que se abren y se le agregan mensajes a medida que se solicitan por el cliente. Datos vienen de Storage
  const [chatsInMemory, setChatsInMemory] = useState([]);

  const [trafficLight, setTrafficLight] = useState([]);

  const [actualChatMessages, setActualChatMessages] = useState([]);

  useEffect(() => {
    sessionRef.current = session;
    chatsInMemoryRef.current = chatsInMemory;
    activeChatDataRef.current = activeChatData;
  });
  const downloadContactsAssets = vector => {
    Promise.all(
      vector.map((item, i) => {
        if (!item.thumbLocal) {
          return new Promise((resolve, _) => {
            downloadAssetsFile(item.thumb, 'avatar', item.id_user)
              .then(res => {
                if (res) {
                  vector[i].thumbLocal = res;
                }
              })
              .then(() => {
                resolve();
              });
          });
        }
      }),
    ).then(() => {
      setContacts(vector);
      setData('contacts', vector);
    });
  };
  const syncContacts = () => {
    Contacts.getAll().then(async contacts => {
      if (session) {
        setContacts(null);
        const newVector = contacts.map(contact => {
          if (contact.phoneNumbers.length != 0) {
            const phoneIt = contact.phoneNumbers.map(phone => {
              return {
                displayName: contact.displayName,
                phone: phone.number,
              };
            });
            return phoneIt[0];
          }
        });
        await axios
          .post(`${ServerURL}/users/sync/contacts`, {
            access: access,
            contactsVector: newVector,
            id_user: session.id_user,
          })
          .then(res => {
            const response = res.data;

            if (response.status == 'success') {
              let newContacts = response.data;
              getData('contacts').then(storageContacts => {
                if (storageContacts) {
                  newContacts
                    .filter(con =>
                      storageContacts.findIndex(
                        con2 => con2.id_user == con.id_user,
                      ) == -1
                        ? storageContacts.push(con)
                        : con,
                    )
                    .reverse();
                  setContacts(storageContacts);
                  setData('contacts', storageContacts);
                  downloadContactsAssets(storageContacts);
                } else {
                  setContacts(newContacts);
                  setData('contacts', newContacts);
                  downloadContactsAssets(newContacts);
                }
              });
            } else {
              Alert.alert(JSON.stringify(response));
            }
          });
      } else {
        getData('contacts').then(storageContacts => {
          if (storageContacts) {
            setContacts(storageContacts);
            setData('contacts', storageContacts);
            downloadContactsAssets(storageContacts);
          } else {
            setContacts([]);
          }
        });
      }
    });
  };
  const logOut = () => {
    closeSocketMethods();
    socket.removeAll
    socket.emit('logout', {access: access, data: {id_user: session.id_user}});
    removeData('session');
    removeData('chats');
    removeData('contacts');
    setSession(null);
    setActiveChatData(null);
    setActualChatMessages([]);
    setContacts([]);
    setChatsInMemory([]);
    setBackLogin(true);
  };
  const getContacts = async () => {
    getData('contacts').then(data => {
      if (data) {
        if (data.length == 0) {
          syncContacts();
        } else {
          setContacts(data);
          syncContacts();
        }
      } else {
        syncContacts();
      }
    });
  };
  const initContacts = () => {
    getContacts();
  };
  const hidePopMenu = () => setVisiblePopMenu(false);

  const showPopMenu = () => setVisiblePopMenu(true);
  const theme = {
    primary: '#80B2FF',
    secondary: '#b9dcff',
    terteary: '#ff8080',
    primaryLight: '#fff',
    backgrounds: '#80FFB2',
    success: '#00ff00',
  };
  useEffect(() => {
    if (session) {
      if (!session.imgURLLocal || !session.thumbLocal) {
        let ajustSession = session;
        downloadAssetsFile(session.imgURL, 'avatar', session.id_user)
          .then(res => {
            if (res) {
              ajustSession.imgURLLocal = res;
            }
            return new Promise((resolve, _) => {
              const nombretemporal = `thumb_${session.id_user}`;
              downloadAssetsFile(session.thumb, 'avatar', nombretemporal)
                .then(res2 => {
                  if (res2) {
                    ajustSession.thumbLocal = res2;
                  }
                })
                .then(() => {
                  resolve();
                });
            });
          })
          .then(() => {
            setSession(ajustSession);
            setData('session', ajustSession);
          });
      }
    }
  }, [session]);
  useEffect(() => {
    getData('chats').then(oldChats => {
      if (oldChats) {
        setChatsInMemory(oldChats);
      }
    });
  }, []);
  useEffect(() => {
    if (session) {
      initContacts();
    }
  }, [session]);
  useEffect(() => {
    if (chatsInMemory) {
      if (chatsInMemory.length != 0) {
        let vector = chatsInMemory;
        Promise.all(
          vector.map((item, i) => {
            if (!item.thumbLocal) {
              return new Promise((resolve, _) => {
                downloadAssetsFile(item.thumb, 'chats', item.id_contact)
                  .then(res => {
                    if (res) {
                      vector[i].thumbLocal = res;
                    }
                  })
                  .then(() => {
                    resolve();
                  });
              });
            }
          }),
        ).then(() => {
          setChatsInMemory(vector);
          setData('chats', vector);
        });
      }
    }
  }, [chatsInMemory]);
  const integrateChats = (recivedData, chats, sessionRef) => {
    let chatsInMemory0 = chats;
    recivedData.map(datachat => {
      datachat = {
        ...datachat,
        imgURL: datachat.imgURL,
      };
      const indexToUpdate0 = chats.findIndex(
        cht => cht.id_chat == datachat.id_chat,
      );
      if (indexToUpdate0 != -1) {
        let oldMessages = chats[indexToUpdate0].messages;
        let newMessages = datachat.messages;
        newMessages.map(newMessage => {
          let bandera = false;
          newMessage = {
            ...newMessage,
            imgURL: newMessage.imgURL,
            status: 'received',
          };
          oldMessages.map(oldMessage => {
            if (oldMessage.id_message == newMessage.id_message) {
              bandera = true;
            }
          });
          if (!bandera) {
            chatsInMemory0[indexToUpdate0] = {
              ...chats[indexToUpdate0],
              messages: [...chats[indexToUpdate0].messages, newMessage],
            };
          }
        });
      } else {
        datachat.messages = datachat.messages.map(newMessage => {
          return {
            ...newMessage,
            imgURL: newMessage.imgURL,
            status: 'received',
          };
        });
        chatsInMemory0 = [...chats, datachat];
      }
      datachat.messages.map(msj => {
        socket.emit('updateMessageStatusInServer', {
          access: access,
          id_user: sessionRef.id_user,
          id_message: msj.id_message,
          status: 'received',
        });
      });
    });
    return chatsInMemory0;
  };
  const integrateStatus = (recivedData, chats) => {
    let chatsInMemory0 = chats;
    recivedData.map(update => {
      const indexToUpdate0 = chats.findIndex(
        cht => cht.id_chat == update.id_chat,
      );
      if (indexToUpdate0 != -1) {
        const indexToUpdate = chats[indexToUpdate0].messages.findIndex(
          msj => msj.id_message == update.id_message,
        );
        if (indexToUpdate != -1) {
          chatsInMemory0[indexToUpdate0].messages[indexToUpdate].status =
            update.status;
        }
      }
    });
    return chatsInMemory0;
  };

  const integrateTrafficLight = (TrafficVector, chats) => {
    const updatedVectorView = chats.map(viewItem => {
      if (viewItem.type == 'single') {
        const indexToUpdate = TrafficVector.findIndex(
          cht => cht.id_contact == viewItem.id_contact,
        );
        if (indexToUpdate != -1) {
          return {
            ...viewItem,
            online: TrafficVector[indexToUpdate].status,
          };
        } else {
          return {...viewItem};
        }
      } else {
        return {...viewItem};
      }
    });
    let updatedVectorView1 = trafficLight.map(traffic => {
      const indexToUpdate1 = TrafficVector.findIndex(
        cht => cht.id_contact == traffic.id_contact,
      );
      if (indexToUpdate1 != -1) {
        if (
          traffic.online == 'online' &&
          TrafficVector[indexToUpdate1].status == 'offline'
        ) {
          return {
            ...traffic,
            online: TrafficVector[indexToUpdate1].status,
            lastOnline: moment(),
          };
        } else {
          return {
            ...traffic,
            online: TrafficVector[indexToUpdate1].status,
          };
        }
      } else {
        return {
          ...traffic,
        };
      }
    });
    TrafficVector.map(newTraffic => {
      const indexToUpdate2 = updatedVectorView1.findIndex(
        oldtraffic => oldtraffic.id_contact == newTraffic.id_contact,
      );
      if (indexToUpdate2 == -1) {
        updatedVectorView1 = [...updatedVectorView1, newTraffic];
      }
    });
    return {
      traffic: updatedVectorView1,
      chats: updatedVectorView,
    };
  };
  const newMessageHadler = (
    recivedData,
    chats,
    activeChatDataRef,
    sessionRef,
  ) => {
    let chatsInMemory0 = chats;
    const indexToUpdate = chatsInMemory0.findIndex(
      cht => cht.id_chat == recivedData.message.id_chat,
    );
    if (indexToUpdate != -1) {
      const newMessage = {
        created_by: recivedData.message.created_by,
        type: recivedData.message.type,
        message: recivedData.message.message,
        id_message: recivedData.message.id_message,
        imgURL: recivedData.message.imgURL,
        username: recivedData.message.username,
        date: recivedData.message.date,
        reply: recivedData.message.reply,
        status: 'received',
      };
      if (activeChatDataRef) {
        if (activeChatDataRef.id_chat == recivedData.message.id_chat) {
          setActualChatMessages(olds => [...olds, newMessage]);
        } else {
          NotifyNewMessage(recivedData.message, theme);
        }
      } else {
        NotifyNewMessage(recivedData.message, theme);
      }
      chatsInMemory0[indexToUpdate] = {
        ...chatsInMemory0[indexToUpdate],
        messages: [...chatsInMemory0[indexToUpdate].messages, newMessage],
      };
    } else {
      const newChatValor = {
        id_chat: recivedData.message.id_chat,
        type: 'single',
        id_contact: recivedData.message.created_by,
        imgURL: recivedData.message.imgURL,
        thumb: recivedData.message.thumb,
        title: recivedData.message.username,
        messages: [
          {
            created_by: recivedData.message.created_by,
            type: recivedData.message.type,
            message: recivedData.message.message,
            id_message: recivedData.message.id_message,
            imgURL: recivedData.message.imgURL,
            username: recivedData.message.username,
            date: recivedData.message.date,
            reply: recivedData.message.reply,
            status: 'received',
          },
        ],
      };
      chatsInMemory0 = [...chatsInMemory0, newChatValor];
      NotifyNewMessage(recivedData.message, theme);
    }
    setChatsInMemory(chatsInMemory0);
    setData('chats', chatsInMemory0);
    if (activeChatDataRef) {
      if (activeChatDataRef.id_chat == recivedData.message.id_chat) {
        socket.emit('updateMessageStatusInServer', {
          access: access,
          id_user: sessionRef.id_user,
          id_message: recivedData.message.id_message,
          status: 'viewed',
        });
      }
    }else{
      socket.emit('updateMessageStatusInServer', {
        access: access,
        id_user: sessionRef.id_user,
        id_message: recivedData.message.id_message,
        status: 'received',
      });
    }
  };
  const updateMessageStatusHadler = (
    recivedData,
    sessionRefe,
    chats,
    activeChatDataRef,
  ) => {
    let chatsInMemory0 = chats;
    switch (recivedData.case) {
      case 'newchat':
        const indexToUpdate01 = chatsInMemory0.findIndex(
          cht => cht.id_chat == recivedData.message.id_chat,
        );
        if (indexToUpdate01 != -1) {
          let temporalMessages = chatsInMemory0[indexToUpdate01].messages;
          const indexToUpdateMessage0 = temporalMessages.findIndex(
            mesj => mesj.id_message == recivedData.message.id_message,
          );
          if (indexToUpdateMessage0 != -1) {
            chatsInMemory0[indexToUpdate01].messages[indexToUpdateMessage0] = {
              ...chatsInMemory0[indexToUpdate01].messages[
                indexToUpdateMessage0
              ],
              status: recivedData.message.status,
              id_message: recivedData.message.id_message,
            };
          } else {
            chatsInMemory0[indexToUpdate01].messages = [
              ...chatsInMemory0[indexToUpdate01].messages,
              {
                id_message: recivedData.message.id_message,
                username: sessionRefe.username,
                created_by: sessionRefe.id_user,
                imgURL: sessionRefe.imgURL,
                message: recivedData.message.message,
                status: recivedData.message.status,
                date: recivedData.message.date,
              },
            ];
          }
          if (activeChatDataRef) {
            if (activeChatDataRef.id_user == recivedData.message.id_contact) {
              setActualChatMessages(olds =>
                chatsInMemory0[indexToUpdate01].messages.slice(
                  olds.length * -1,
                ),
              );
            }
          }
          setChatsInMemory(chatsInMemory0);
          setData('chats', chatsInMemory0);
        } else {
          const newChatValor = {
            id_chat: recivedData.message.id_chat,
            type: 'single',
            id_contact: recivedData.message.id_contact,
            imgURL: recivedData.message.imgURL,
            thumb: recivedData.message.thumb,
            title: recivedData.message.title,
            messages: [
              {
                id_message: recivedData.message.id_message,
                username: sessionRefe.username,
                created_by: sessionRefe.id_user,
                imgURL: sessionRefe.imgURL,
                message: recivedData.message.message,
                status: recivedData.message.status,
                date: recivedData.message.date,
              },
            ],
          };
          if (activeChatDataRef) {
            if (activeChatDataRef.id_user == recivedData.message.id_contact) {
              setActualChatMessages(olds =>
                newChatValor.messages.slice(olds.length * -1),
              );
            }
          }
          chatsInMemory0 = [...chatsInMemory0, newChatValor];
          setChatsInMemory(chatsInMemory0);
          setData('chats', chatsInMemory0);
        }
        break;
      case 'fromothers':
        const indexToUpdate0 = chatsInMemory0.findIndex(
          cht => cht.id_chat == recivedData.message.id_chat,
        );
        if (indexToUpdate0 != -1) {
          let temporalMessages = chatsInMemory0[indexToUpdate0].messages;
          const indexToUpdateMessage = temporalMessages.findIndex(
            mesj => mesj.id_message == recivedData.message.id_message,
          );
          if (indexToUpdateMessage != -1) {
            chatsInMemory0[indexToUpdate0].messages[indexToUpdateMessage] = {
              ...chatsInMemory0[indexToUpdate0].messages[indexToUpdateMessage],
              status: recivedData.message.status,
            };
            if (activeChatDataRef) {
              if (activeChatDataRef.id_chat == recivedData.message.id_chat) {
                let newMenssage = chatsInMemory0[
                  indexToUpdate0
                ].messages.filter(element => {
                  return element.id_message == recivedData.message.id_message;
                });

                let othersMessages = chatsInMemory0[
                  indexToUpdate0
                ].messages.filter(element => {
                  return element.id_message != recivedData.message.id_message;
                });
                setActualChatMessages(olds =>
                  othersMessages.concat(newMenssage).slice(olds.length * -1),
                );
              }
            }
            setChatsInMemory(chatsInMemory0);
            setData('chats', chatsInMemory0);
          }
        }
        break;
      case 'selfmessage':
        const indexToUpdate = chatsInMemory0.findIndex(
          cht => cht.id_chat == recivedData.message.id_chat,
        );
        if (indexToUpdate != -1) {
          chatsInMemory0[indexToUpdate].messages = chatsInMemory0[
            indexToUpdate
          ].messages.filter(element => {
            return element.id_message !== 0;
          });
          const newMessage = {
            id_message: recivedData.message.id_message,
            username: sessionRefe.username,
            created_by: sessionRefe.id_user,
            imgURL: sessionRefe.imgURL,
            message: recivedData.message.message,
            status: recivedData.message.status,
            date: recivedData.message.date,
            reply: recivedData.message.reply,
          };

          chatsInMemory0[indexToUpdate] = {
            ...chatsInMemory0[indexToUpdate],
            messages: [...chatsInMemory0[indexToUpdate].messages, newMessage],
          };
          if (activeChatDataRef) {
            if (activeChatDataRef.id_chat == recivedData.message.id_chat) {
              setActualChatMessages(olds =>
                chatsInMemory0[indexToUpdate].messages.slice(olds.length * -1),
              );
            }
          }
          setChatsInMemory(chatsInMemory0);
          setData('chats', chatsInMemory0);
        }
        break;
      default:
        break;
    }
  };
  const handler0 = userData => {
    setSession(userData);
    getData('chats').then(oldChats => {
      let tempChats = [];
      if (oldChats) {
        tempChats = oldChats;
      }
      if (userData.chats.lenght != 0) {
        tempChats = integrateStatus(userData.messagesUpdated, tempChats);
      }
      if (userData.chats.lenght != 0) {
        tempChats = integrateChats(
          userData.chats,
          tempChats,
          sessionRef.current,
        );
      }
      let res = integrateTrafficLight(userData.trafficLight, tempChats);
      setTrafficLight(res.traffic);
      setChatsInMemory(res.chats);
      setData('chats', res.chats);
    });
  };
  const listenLoguedIn = () => {
    socket.on('loguedIn', handler0);
  };
  const handler1 = data => {
    getData('session').then(mySession => {
      if (mySession) {
        updateMessageStatusHadler(
          data,
          mySession,
          chatsInMemoryRef.current,
          activeChatDataRef.current,
        );
      }
    });
  };
  const listenUpdateStatus = () => {
    socket.on('updateMessageStatus', handler1);
  };
  const handler3 = data => {
    getData('session').then(mySession => {
      if (mySession) {
        newMessageHadler(
          data,
          chatsInMemoryRef.current,
          activeChatDataRef.current,
          mySession,
        );
      }
    });
  };
  const listenMessages = () => {
    socket.on('newMessage', handler3);
  };
  const handler5 = data => {
    integrateTrafficLight(data, chatsInMemoryRef.current);
  };
  const listenTrafficLight = () => {
    socket.on('updateTrafficLight', handler5);
  };
  const initSocketMethods = () => {
    listenLoguedIn();
    listenUpdateStatus();
    listenMessages();
    listenTrafficLight();
  };
  const closeSocketMethods = () => {
    socket.off('loguedIn', handler0);
    socket.off('updateMessageStatus', handler1);
    socket.off('newMessage', handler3);
    socket.off('updateTrafficLight');
    socket.removeEventListener('loguedIn');
    socket.removeEventListener('updateMessageStatus');
    socket.removeEventListener('newMessage');
    socket.removeEventListener('updateTrafficLight');
  };
  return (
    <MainContext.Provider
      value={{
        initSocketMethods,
        chatsInMemory,
        actualChatMessages,
        setActualChatMessages,
        logOut,
        initContacts,
        setBackLogin,
        backLogin,
        setFCMToken,
        FCMtoken,
        setActiveChatData,
        activeChatData,
        syncContacts,
        contacts,
        hidePopMenu,
        showPopMenu,
        visiblePopMenu,
        setSession,
        session,
        theme,
        loading,
        setLoading,
      }}>
      {children}
    </MainContext.Provider>
  );
};
