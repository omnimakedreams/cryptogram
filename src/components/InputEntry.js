import React, {
    useEffect,
    useState,
    useContext
} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { useMainContext } from "../context/AppContext";
import PopMenu from "../components/PopMenu";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { multimediaURL } from "../commons/variables";
import { useNavigate } from "react-router-native";

const InputEntry = ({ setMessage, message, addmessage }) => {
    const context = useMainContext();
    let { loading, setLoading, session, setSession, theme, showPopMenu, activeChatData } = context;

    return (
        <View style={styles.root(theme)}>
            <TouchableOpacity
                style={styles.iconStyle}
                onPress={()=>{
                    console.log("here");
                }}
            >
                <Icon name='sticky-note' size={30} color={theme.terteary} />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.iconStyle}
                onPress={()=>{
                    console.log("here");
                }}
            >
                <Icon name='paperclip' size={30} color={theme.terteary} />
            </TouchableOpacity>
            <View style={styles.inputarea}>
                <TextInput
                    style={styles.input}
                    onChangeText={setMessage}
                    value={message}
                    multiline
                    placeholder={"Escribe un mensaje aquí"}
                    numberOfLines={4}
                />
            </View>
            {
                (message=="")?
                    <TouchableOpacity
                        style={styles.iconStyle}
                        onPress={()=>{
                            console.log("here");
                        }}
                    >
                        <Icon name='microphone' size={30} color={theme.terteary} />
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={styles.iconStyle}
                        onPress={()=>{
                            addmessage();
                        }}
                    >
                        <Icon name='paper-plane' size={30} color={theme.terteary} />
                    </TouchableOpacity>  
            }
            
        </View>
    )
}
const styles = StyleSheet.create({
    root: theme => ({
        height: 55,
        backgroundColor: theme.primaryLight,
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 5
    }),
    title: {
        fontSize: 22,
        color: "#fff",
        paddingLeft: 5
    },
    iconStyle: {
        width: "10%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputarea:{
        flex: 1,
    },
    input:{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        marginTop: 0
    }
});
export default InputEntry;