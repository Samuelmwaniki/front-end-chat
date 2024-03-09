import io from 'socket.io-client';


export class WebSocketService {

    private socket: any;

    constructor() {} 

    async connect()
    {
        this.socket = io('http://localhost:3030/active_chats');  
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
        return this.socket;
    }
}