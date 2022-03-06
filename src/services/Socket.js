import socketIO from 'socket.io-client';
import { access, ServerURL } from '../commons/variables';
export const socket = socketIO(ServerURL, { transports: ['websocket'], jsonp: false });   
socket.connect();  
socket.on('error', reason =>{
    console.log(reason);
    if(socket.disconnected){
        console.log("Intentando reconectar");
        socket.connect(); 
    }
});
socket.on('errors', error =>{
    console.log(error);
});
export const storeClientInfo = (info) => {
    if(socket.connected){
        info.id_socket = socket.id;
        socket.emit('storeClientInfo', {
            access: access,
            data : info
        });
    }
}