import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import {useMainContext} from '../context/AppContext';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Icon2 from 'react-native-vector-icons/dist/SimpleLineIcons';

export default Message = ({data, index, scrollView}) => {
  const context = useMainContext();
  let {session, theme, actualChatMessages} = context;
  const tempIndex = actualChatMessages
    .map(el => el.created_by)
    .lastIndexOf(session.id_user);
    function findMyIndex(id) {
      let a = actualChatMessages.findIndex(
        msj => msj.id_message == id,
      );
      if(a!=-1){
        scrollView.scrollToIndex({
          index: a,
        })
      }
    }
  return (
    <TouchableHighlight key={index} style={styles.root}>
      {data.created_by != session.id_user ? (
        <View style={styles.box2}>
          <View style={styles.messageBurbleDiv(false)}>
            <View style={styles.messageBurble(theme, false)}>
              {data.reply ? (
                data.reply != 0 ? (
                  <Pressable
                    onPressIn={() =>
                      findMyIndex(data.reply.id_message)
                    }
                    style={styles.replyBox(data.created_by != session.id_user)}>
                    <Text style={styles.reply}>{data.reply.username}</Text>
                    <Text style={{color: '#525252'}}>
                      {data.reply.message
                        ? data.reply.message.length > 35
                          ? data.reply.message.substring(0, 35) + '...'
                          : data.reply.message.substring(0, 35)
                        : 'Cargando...'}
                    </Text>
                  </Pressable>
                ) : (
                  false
                )
              ) : (
                false
              )}
              <Text style={styles.message(theme, false)}>{data.message}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.box1}>
          <View style={styles.messageBurbleDiv(true)}>
            <View style={styles.messageBurble(theme, true)}>
              {data.reply ? (
                data.reply != 0 ? (
                  <Pressable
                    onPressIn={() =>
                      findMyIndex(data.reply.id_message)
                    }
                    style={styles.replyBox(data.created_by != session.id_user)}>
                    <Text style={styles.reply}>{data.reply.username}</Text>
                    <Text style={{color: '#525252'}}>
                      {data.reply.message
                        ? data.reply.message.length > 35
                          ? data.reply.message.substring(0, 35) + '...'
                          : data.reply.message.substring(0, 35)
                        : 'Cargando...'}
                    </Text>
                  </Pressable>
                ) : (
                  false
                )
              ) : (
                false
              )}
              <Text style={styles.message(theme, true)}>{data.message}</Text>
            </View>
            {tempIndex == index || data.status == 'sending' ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  padding: 0,
                  margin: 0,
                  marginRight: 8,
                  marginBottom: 2,
                }}>
                {data.status == 'sending' ? (
                  <Icon2 name="clock" color="#c0c0c0" size={15} />
                ) : data.status == 'sent' ? (
                  <Icon name="checkmark" color="#c0c0c0" size={15} />
                ) : (
                  <Icon
                    name="checkmark-done"
                    color={data.status == 'viewed' ? '#0080ff' : '#c0c0c0'}
                    size={15}
                  />
                )}
                <Text style={styles.reply}>
                  {data.status == 'sending'
                    ? 'Enviando'
                    : data.status == 'sent'
                    ? 'Enviado' :  data.status == 'received'
                    ? 'Recibido'
                    : 'Visto'}
                </Text>
              </View>
            ) : (
              false
            )}
          </View>
        </View>
      )}
    </TouchableHighlight>
  );
};
const styles = StyleSheet.create({
  root: {},
  box2: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  box1: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 0,
  },
  reply: {
    textAlign: 'left',
    color: '#555555',
    fontSize: 12,
  },
  messageStatus: right => ({
    textAlign: right ? 'right' : 'left',
    fontSize: 10,
  }),
  messageBurbleDiv: right => ({
    width: '100%',
    alignItems: right ? 'flex-end' : 'flex-start',
    justifyContent: 'flex-end',
    marginBottom: 5,
  }),
  messageBurble: (theme, right) => ({
    maxWidth: '80%',
    minHeight: 40,
    backgroundColor: right ? theme.primary : '#fff',
    borderWidth: right ? 0 : 2,
    borderColor: theme.secondary,
    borderRadius: 12,
    padding: 12,
  }),
  message: (theme, right) => ({
    color: right ? '#fff' : 'gray',
    textAlign: right ? 'right' : 'left',
    fontSize: 13,
  }),
  replyBox: me => ({
    backgroundColor: me ? '#eeeeee' : '#fff',
    height: 55,
    borderRadius: 3,
    padding: 10,
    marginBottom: 5,
  }),
});
