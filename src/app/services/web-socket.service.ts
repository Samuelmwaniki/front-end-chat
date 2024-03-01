import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:3000'); // Replace with your WebSocket server URL
  }

  sendMessage(message: string): void {
    this.socket$.next({ event: 'sendChat', data: message });
  }
}
