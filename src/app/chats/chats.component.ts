import { Component, OnInit } from '@angular/core';

interface Message {
  sender: string;
  content: string;
  
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';

  constructor() { }

  ngOnInit(): void {
    // Fetch initial messages or subscribe to real-time updates here
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      // Simulate sending message to backend and receiving response
      this.messages.push({ sender: 'Me', content: this.newMessage });
      this.newMessage = ''; // Clear input field after sending message
    }
  }
}
