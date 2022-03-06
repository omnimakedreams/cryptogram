import React, {useEffect, useState, useContext} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import {useNavigate} from 'react-router-native';

import {storeClientInfo} from '../services/Socket';
import {useMainContext} from '../context/AppContext';
import Loader from '../components/Loader';
import {AppName, ServerURL, access} from '../commons/variables';
import {setData} from '../services/storage';
import axios from 'axios';
import {getData as getAPI, removeData} from '../services/storage';
import messaging from '@react-native-firebase/messaging';

const Login = () => {
  let navigate = useNavigate();
  const [number, onChangeNumber] = useState('');
  const context = useMainContext();
  let {
    theme,
    loading,
    setLoading,
    setSession,
    session,
    setFCMToken,
    FCMtoken,
    setBackLogin,
  } = context;
  useEffect(() => {
    setBackLogin(false);
      getAPI('session').then(data => {
        if (data) {
          setSession(data);
          messaging()
            .getToken()
            .then(token => {
              let toSendData = data;
              toSendData.token = token;
              storeClientInfo(toSendData);
              setFCMToken(token);
              navigate('/home');
              // removeData("session");
            });
        } else {
          console.log("No hay sesión en el storage");
          setLoading(false)
        }
    });
  }, []);
  function verify() {
    if (number != '') {
      getData('users/add', {
        access,
        phone: number,
      });
    } else {
      Alert.alert('Debes ingresar un número de teléfono.');
    }
  }
  const getData = async (path, request) => {
    setLoading(true);
    await axios.post(`${ServerURL}/${path}`, request).then(res => {
      const response = res.data;
      if (response.status == 'success') {
        messaging()
          .getToken()
          .then(token => {
            let toSendData = response.data;
            toSendData.token = token;
            storeClientInfo(toSendData);
            setFCMToken(token);
            navigate('/home');
            // removeData("session");
          });
      } else {
        Alert.alert(JSON.stringify(response));
      }
      setLoading(false);
    });
  };
  if (loading) {
    return (
      <View style={styles.loader}>
        <Loader />
      </View>
    );
  }
  return (
    <View style={styles.root}>
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}> Bienvenid@ a {AppName} </Text>
        <Text style={styles.welcomeSubtitle}>
          Ingresa tu número de teléfono y sé parte de la comunidad.{' '}
        </Text>
      </View>
      <View style={styles.number}>
        <Text>+58 </Text>
        <TextInput
          style={styles.input(theme)}
          onChangeText={onChangeNumber}
          value={number}
          placeholder="Tu número de teléfono"
          placeholderTextColor="#fff"
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.button(theme)} onPress={verify}>
        <Text style={styles.buttonText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: theme => ({
    height: 50,
    width: '70%',
    padding: 15,
    backgroundColor: theme.secondary,
    borderRadius: 25,
  }),
  text: {
    color: 'black',
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
  },
  button: theme => ({
    marginTop: 10,
    borderRadius: 25,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 50,
    paddingRight: 50,
    shadowOpacity: 1.2,
    elevation: 0,
    backgroundColor: theme.primary,
    color: '#fff',
    height: 40,
    justifyContent: 'center',
  }),
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  number: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: '70%',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    fontSize: 15,
  },
});
export default Login;
