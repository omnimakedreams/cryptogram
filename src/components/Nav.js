import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {useMainContext} from '../context/AppContext';
import {useChatListContext} from '../context/ChatListContext';
import PopMenu from '../components/PopMenu';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {multimediaURL} from '../commons/variables';
import moment from 'moment';
require('moment/locale/es.js');
const Nav = () => {
  const context = useMainContext();
  let {
    loading,
    setLoading,
    session,
    setActualChatMessages,
    theme,
    setActiveChatData,
    activeChatData,
  } = context;
  const context2 = useChatListContext();
  const {vista, toggleVista} = context2;
  function backToHome() {
    setActiveChatData(null);
    setActualChatMessages([]);
    toggleVista('chats');
  }
  return (
    <View style={styles.root(theme)}>
      {vista == 'addChat'? (
        <TouchableOpacity style={styles.divLeft} onPress={backToHome}>
          <Icon name="chevron-left" size={30} color="#fff" />
          <Text style={styles.title} numberOfLines={1}>
            Volver
          </Text>
        </TouchableOpacity>
      ) : vista == 'oneChat' ? (
        <View style={styles.fullChat}>
          <TouchableOpacity onPress={backToHome}>
            <Icon name="chevron-left" size={30} color="#fff" />
          </TouchableOpacity>
          <View style={styles.chatDivAvatar}>
            <Image
              style={styles.avatar(theme)}
              source={{
                uri: activeChatData.thumbLocal
                  ? activeChatData.thumbLocal
                  : activeChatData.thumb,
              }}
            />
          </View>
          <View style={styles.chatDivTitles}>
            <Text numberOfLines={1} style={styles.title}>
              {activeChatData.displayName}
            </Text>
            {activeChatData.online ? (
              <Text numberOfLines={1} style={styles.statusUser}>
                {activeChatData.online == 'online'
                  ? 'En línea'
                  : 'ult. vez '+moment(activeChatData.online).format('l h:mm a')}
              </Text>
            ) : (
              false
            )}
          </View>
        </View>
      ) : (
        <View style={styles.divLeft}>
          <Text numberOfLines={1} style={styles.title}>
            Cryptogram
          </Text>
        </View>
      )}

      <View style={styles.divRight}>
        <PopMenu vista={vista} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  root: theme => ({
    height: 70,
    backgroundColor: theme.primary,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  }),
  statusUser: {
    fontSize: 14,
    color: '#fff',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    paddingLeft: 5,
  },
  chatDivTitles: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  divLeft: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  divRight: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatDivAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '18%',
  },
  avatar: theme => ({
    borderRadius: 100,
    width: 40,
    height: 40,
    borderColor: theme.primary,
  }),
  fullChat: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
export default Nav;
