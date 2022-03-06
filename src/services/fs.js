import {MainLogo, backgroundChat, localBackground, makeid } from '../commons/variables';
const RNFS = require('react-native-fs');
const getAppLogo = () => {
  RNFS.exists(
    'file://' + RNFS.ExternalStorageDirectoryPath + '/Cryptogram/assets/logo.png',
  ).then(exists => {
    if (exists) {
      console.log('Logo OK.');
    } else {
      const Assetsfolder = RNFS.ExternalStorageDirectoryPath + '/Cryptogram/assets';
      RNFS.mkdir(Assetsfolder);
      RNFS.downloadFile({
        fromUrl: MainLogo,
        toFile: `file://${Assetsfolder}/logo.png`,
      }).promise.then(r => {
        console.log('Logo descargado exitosamente.');
      });
    }
  });
};
const getChatBackground = () => {
  RNFS.exists(
    'file:/' +
      RNFS.ExternalStorageDirectoryPath +
      '/Cryptogram/assets/backgrounds/background.png',
  ).then(exists => {
    if (exists) {
      console.log('ChatBackground OK.');
    } else {
      const Assetsfolder =
        RNFS.ExternalStorageDirectoryPath + '/Cryptogram/assets/backgrounds';
      RNFS.mkdir(Assetsfolder);
      RNFS.downloadFile({
        fromUrl: backgroundChat,
        toFile: `file://${Assetsfolder}/background.png`,
      }).promise.then(r => {
        console.log("Background Descargado OK.");
      });
    }
  });
};
const makeDirs = (subFolder) => {
  let Assetsfolder = `${RNFS.ExternalStorageDirectoryPath}/Cryptogram/assets/${subFolder}`;
  RNFS.mkdir(Assetsfolder);
}
function getFileExtension(filename) {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}
export const downloadAssetsFile = (url, subFolder, id_user) => {
  return new Promise((resolve, _) => {
    const ext = getFileExtension(url);
    const ExitURL = `file://${RNFS.ExternalStorageDirectoryPath}/Cryptogram/assets/${subFolder}/${id_user}.${ext}`;
    RNFS.exists(
      ExitURL,
    ).then(exists => {
      if (exists) {
        resolve(ExitURL);
      } else {
        makeDirs(subFolder);
        RNFS.downloadFile({
          fromUrl: url,
          toFile: ExitURL,
        }).promise.then(r => {
          RNFS.exists(
            ExitURL,
          ).then(exists => {
            if(exists){
              resolve(ExitURL);
            }else{
              resolve(false);
            }
          })
        });
      }
    });
})
  
};
export const initAssets = () => {
  // getAppLogo();
  getChatBackground();
};
