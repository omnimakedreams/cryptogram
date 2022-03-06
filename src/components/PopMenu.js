import React, {useState} from 'react';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import {useMainContext} from '../context/AppContext';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {Link} from 'react-router-native';
export default function PopMenu({vista, selectPhoto}) {
  const context = useMainContext();
  let {hidePopMenu, showPopMenu, visiblePopMenu, syncContacts, logOut} =
    context;
  return (
    <View style={styles.root}>
      <Menu
        visible={visiblePopMenu}
        anchor={
          <TouchableOpacity style={styles.iconButton} onPress={showPopMenu}>
            <Icon name="ellipsis-v" size={30} color="#fff" />
          </TouchableOpacity>
        }
        onRequestClose={hidePopMenu}>
        {vista == 'addChat' ? (
          <>
            <MenuItem
              onPress={() => {
                hidePopMenu();
                syncContacts();
              }}>
              Actualizar
            </MenuItem>
            <MenuItem disabled>Disabled item</MenuItem>
            <MenuDivider />
            <MenuItem onPress={hidePopMenu}>Cancelar</MenuItem>
          </>
        ) : vista == 'chats' ? (
          <Link to="/">
            <MenuItem
              onPress={() => {
                hidePopMenu();
                logOut();
              }}>
              Cerrar Sesión
            </MenuItem>
          </Link>
        ) : vista == 'photo' ? (
          <>
            <MenuItem
              onPress={() => {
                hidePopMenu();
                selectPhoto('gallery');
              }}>
              Seleccionar de galería
            </MenuItem>
            <MenuItem
              onPress={() => {
                hidePopMenu();
                selectPhoto('camera');
              }}>
              Tomar fotografía
            </MenuItem>
          </>
        ) : (
          false
        )}
      </Menu>
    </View>
  );
}
const styles = StyleSheet.create({
  root: theme => ({
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  iconButton: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
