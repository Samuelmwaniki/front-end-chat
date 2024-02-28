import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

interface Message {
  sender: string;
  content: string;
}

interface User {
  id: number;
  username: string;
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';
  users: User[] = [];
  selectedUser: number | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Fetch initial messages from sessionStorage when component initializes
    const storedMessages = sessionStorage.getItem('messages');
    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);
    }

    // Fetch users for dropdown menu
  //   this.apiService.getUsers().subscribe((users: User[]) => {
  //     this.users = users;
  //   });
  // }
  }
  sendMessage(): void {
    if (this.newMessage.trim() !== '' && this.selectedUser !== null) {
      // Simulate sending message to backend and receiving response
      const newMessage: Message = { sender: 'Me', content: this.newMessage };
      this.messages.push(newMessage);

      // Store updated messages in sessionStorage
      sessionStorage.setItem('messages', JSON.stringify(this.messages));

      this.newMessage = ''; // Clear input field after sending message
    }
  }
}
