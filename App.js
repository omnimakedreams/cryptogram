import React, {
  useEffect,
  useState,
  useContext
} from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Text
} from 'react-native';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import { NativeRouter, Route, Routes, useNavigate, Redirect } from "react-router-native";
import { MainProvider, useMainContext } from "./src/context/AppContext";
import Login from "./src/pages/Login";
import Home from "./src/pages/Home";
import Chat from "./src/pages/Chat";
import { socket } from "./src/services/Socket";
import { initAssets } from "./src/services/fs";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);

const Topics = () => <Text>Topics</Text>;

const App = () => {
  return (
    <MainProvider><Main /></MainProvider>
  )
}
const Main = () => {
  const context = useMainContext();
  let { theme } = context;
  useEffect(() => {
    requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.READ_CONTACTS, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then((statuses) => {
      console.log('CAMERA', statuses[PERMISSIONS.ANDROID.CAMERA]);
      console.log('READ_CONTACTS', statuses[PERMISSIONS.ANDROID.READ_CONTACTS]);
      console.log('READ_EXTERNAL_STORAGE', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
      console.log('RECORD_AUDIO', statuses[PERMISSIONS.ANDROID.RECORD_AUDIO]);
      console.log('WRITE_EXTERNAL_STORAGE', statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);
    });
    socket.on('connect', () => {
      console.log("Conexión Socket ON OK");
    });
    socket.on('loguedOut', () => {
      console.log("Conexión Socket OFF Ok");
    });
    return () => {
      socket.off('connect');
      socket.off('loguedOut');
    }
  }, [])
  useEffect(() => {
    initAssets();
  }, [])
  return (
    <View style={styles.root(theme)}>
      <StatusBar barStyle='light-content' backgroundColor={theme.primary} />
      <NativeRouter>
        <MainProvider>
          <Routes>
            <Route exact path="/" element={<Login />}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </MainProvider>
      </NativeRouter>
    </View>
  );
};

const styles = StyleSheet.create({
  root: theme => ({
    flex: 1,
    backgroundColor: "#fff",
  }),
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  }
});

export default App;
