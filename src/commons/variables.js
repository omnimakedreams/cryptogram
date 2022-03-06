export const AppName = "Cryptogram";
export const access = {
    "username": "Usuario de acceso encriptada nivel DIOS",
    "password": "Clave de acceso encriptada nivel DIOS"
}
//export const ServerURL = "http://10.0.2.2:4001";
//export const multimediaURL= 'http://10.0.2.2:4001/';
export const ServerURL = "https://cryptochatomniserver.herokuapp.com";
export const multimediaURL= 'https://cryptochatomniserver.herokuapp.com/';

//Download Backgorund for Chats
export const backgroundChat = multimediaURL+'resources/background.png';
//Download Logo
export const MainLogo = multimediaURL+'resources/Logo.png'

export const makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export const imgbburl = "https://api.imgbb.com/1/upload";

const RNFS = require('react-native-fs');
//Dowloaded files urls
export let MyBackground = 'https://i.ibb.co/ftN4DkP/background.png';
export let localBackground = `file://${RNFS.ExternalStorageDirectoryPath}/Cryptogram/assets/backgrounds/background.png`;
// export const AppLogo = 'file://' + RNFS.ExternalStorageDirectoryPath + '/Cryptogram/assets/logo.png';
