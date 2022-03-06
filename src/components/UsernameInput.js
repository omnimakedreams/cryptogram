import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useMainContext} from '../context/AppContext';
import {setData} from '../services/storage';
import {multimediaURL, ServerURL, access, imgbburl} from '../commons/variables';
import axios from 'axios';
import PopMenu from '../components/PopMenu';
import ImagePicker from 'react-native-image-crop-picker';

const UsernameInput = () => {
  const {theme, setLoading, session, setSession, hidePopMenu, showPopMenu} =
    useMainContext();
  const [username, onChangeUsername] = useState('');
  const [actualimg, setActualimg] = useState(null);
  useEffect(() => {
    if (session) {
      const url = session.imgURL;
      setActualimg(url);
    }
  }, [session]);
  function verify() {
    if (username != '') {
      setProfileData('users/update', {
        access,
        id_user: session.id_user,
        username: username,
      });
    } else {
      Alert.alert('Debes ingresar un nombre de usuario.');
    }
  }

  const setProfileData = async (path, request) => {
    setLoading(true);
    await axios.post(`${ServerURL}/${path}`, request).then(res => {
      const response = res.data;
      if (response.status == 'success') {
        if (request.imgobject) {
            console.log(response.data.imgURL);
          setActualimg(response.data.imgURL);
        }
        setData('session', response.data);
        setSession(response.data);
      } else {
        Alert.alert(JSON.stringify(response));
      }
      setLoading(false);
    });
  };
  async function selectPhoto(type) {
    if (type == 'camera') {
      await ImagePicker.openCamera({
        cropping: true,
        width: 300,
        height: 300,
        cropperCircleOverlay: true,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        includeBase64: true,
      })
        .then(image => {
          setIMGURL(image);
        })
        .catch(e => {
          console.log(e);
        });
      console.log('camera');
    } else {
      await ImagePicker.openPicker({
        cropping: true,
        width: 300,
        height: 300,
        cropperCircleOverlay: true,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        includeBase64: true,
      })
        .then(image => {
          setIMGURL(image);
        })
        .catch(e => console.log(e));
      console.log('gallery');
    }
  }
  async function getData(base64) {
    try {
      const params = new URLSearchParams();
      params.append('image', base64);
      let res = await axios.post(
        imgbburl + '?key=422ecf7d3657705a1b4f61d39718e465',
        params,
      );
      return res.data;
    } catch (err) {
      console.error('here', err);
    }
  }
  const setIMGURL = async pic => {
    getData(pic.data).then(resp => {
      console.log(resp);
      let obj = {
        imgURL: resp.data.image.url,
        thumb: resp.data.thumb.url,
        delete: resp.data.delete_url,
      };
      setProfileData('users/update', {
        access: access,
        id_user: session.id_user,
        imgobject: obj,
      });
    });
  };
  
  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.divavatar} onPress={showPopMenu}>
        <Image style={styles.avatar} source={{ uri: actualimg }} />
      </TouchableOpacity>
      <PopMenu vista={'photo'} selectPhoto={selectPhoto} />
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>Completa tus datos</Text>
        <Text style={styles.welcomeSubtitle}>
          Por favor indicanos un nombre de usuario. Este será visible para tus
          contactos.{' '}
        </Text>
      </View>
      <View style={styles.number}>
        <TextInput
          style={styles.input(theme)}
          onChangeText={onChangeUsername}
          value={username}
          placeholder="Nombre de usuario"
          placeholderTextColor="#fff"
        />
      </View>
      <TouchableOpacity style={styles.button(theme)} onPress={verify}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight,
  },
  divavatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  avatar: {
    borderRadius: 100,
    width: 200,
    height: 200,
  },
  input: theme => ({
    height: 50,
    width: '70%',
    padding: 15,
    backgroundColor: theme.primary,
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
    width: '80%',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    fontSize: 15,
  },
  avatarOpacity: {
    height: '100%',
    borderRadius: 25,
  },
});
export default UsernameInput;
