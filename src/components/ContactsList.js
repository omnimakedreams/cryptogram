import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useMainContext} from '../context/AppContext';
import {useChatListContext} from '../context/ChatListContext';
import {multimediaURL} from '../commons/variables';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {useNavigate} from 'react-router-native';
import Nav from '../components/Nav';
const ContactList = ({setParamsChat}) => {
  let navigate = useNavigate();
  const context = useMainContext();
  const {theme, session, contacts, initContacts, setActiveChatData} =
    context;
  const context2 = useChatListContext();
  const {vista, toggleVista} = context2;
  function goChat(contact) {
    setActiveChatData(contact);
    toggleVista('oneChat');
    setParamsChat({
      id: contact.id_user,
      type: 'new',
    });
  }
  useEffect(() => {
    initContacts();
  }, []);
  if (vista != 'addChat') {
    return <></>;
  }
  return (
    <View style={styles.root0}>
      <ScrollView contentContainerStyle={styles.root}>
        {contacts
          ? contacts.map((contact, i) => (
              <Pressable
                key={i}
                style={styles.chatItem(theme)}
                onPressIn={() => goChat(contact)}>
                <View style={styles.chatDiv0}>
                  <Image
                    style={styles.avatar(theme)}
                    source={{
                      uri: contact.thumbLocal
                        ? contact.thumbLocal
                        : contact.thumb,
                    }}
                  />
                </View>
                <View style={styles.chatMainDiv}>
                  <View style={styles.chatDivTitle}>
                    <View style={styles.chatSubDiv1}>
                      <Text numberOfLines={1} style={styles.title}>
                        {contact.displayName}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.chatDiv}>
                    <Text numberOfLines={1} style={styles.messageText}>
                      {contact.phone}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          : false}
        {contacts == null ? (
          <View style={styles.indicatorDiv(false)}>
            <ActivityIndicator
              size="large"
              color={theme.primary}
              style={styles.loader}
            />
            <Text numberOfLines={1} style={styles.loaderMessage(true)}>
              Cargando contactos disponibles
            </Text>
          </View>
        ) : (
          false
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  root0: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatItem: theme => ({
    backgroundColor: theme.primaryLight,
    borderWidth: 2,
    borderColor: theme.secondary,
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
  avatar: theme => ({
    borderRadius: 100,
    width: 70,
    height: 70,
    borderColor: theme.secondary,
    borderWidth: 1,
  }),
  chatMainDiv: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  chatDiv0: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '18%',
  },
  chatDiv: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  chatDiv2: {
    width: '20%',
    justifyContent: 'flex-end',
  },
  chatDivTitle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
  chatSubDiv1: {
    width: '80%',
    paddingLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  chatSubDiv2: {
    width: '20%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageText: {
    textAlign: 'left',
    marginLeft: 10,
  },
  timeText: {
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
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
    fontSize: 10,
  }),
});
export default ContactList;
