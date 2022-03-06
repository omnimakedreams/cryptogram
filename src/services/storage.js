import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        console.log("Error de storage:", e)
        // saving error
    }
}

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            // value previously stored
            return JSON.parse(value);
        }else{
            return false;
        }
    } catch (e) {
        console.log("Error de storage:", e)
        return false;
        // error reading value
    }
}

export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (e) {
        console.log("Error de storage:", e)
        return false;
        // error reading value
    }
}