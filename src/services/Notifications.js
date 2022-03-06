import PushNotification from "react-native-push-notification";

export const NotifyNewMessage = async (data, theme) => {
    PushNotification.localNotification({
        channelId: "newMessage",
        bigText: data.message,
        subText: 'Nuevo mensaje',
        title: data.username,
        message: data.message,
        showWhen: true,
        largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
        largeIconUrl: data.imgURL,
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'android.resource://com.ascendapp/raw/ding',
        bigLargeIconUrl: data.imgURL, // (optional) default: undefined
        color: theme.primary,
        invokeApp: true,
        actions: ["ReplyInput"],
        reply_placeholder_text: "Escribe tu respuesta...", // (required)
        reply_button_text: "Responder",
    })
    PushNotification.setApplicationIconBadgeNumber(1);
}
