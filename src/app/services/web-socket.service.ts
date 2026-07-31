import io from 'socket.io-client';

export class WebSocketService {

    private socket: any;

    constructor() {}

    async connect()
    {
        // Guard against creating a second socket if connect() is ever
        // called more than once — reuse the existing connection instead.
        if (this.socket) {
            return this.socket;
        }

        this.socket = io('http://localhost:3030/active_chats');
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
        return this.socket;
    }

    // NEW: tells the gateway which user this socket belongs to, so it can
    // track online/offline status. Call this once, right after connect(),
    // as soon as you know the current user's id.
    identify(userId: string) {
        this.socket?.emit('identify', userId);
    }
}