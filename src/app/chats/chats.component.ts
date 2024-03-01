import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';


interface User {
  _id: string;
  username: string;
}

interface Message {
  _id: number;
  sender: User;
  recepient: User;
  chat: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';
  currentUser: User = {} as any;
  users: User[] = [];
  selectedUserId: string = '';
  selectedUser: User = {} as any;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    // Fetch initial messages from sessionStorage when component initializes
    const storedMessages = sessionStorage.getItem('messages');
    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      this.router.navigateByUrl('/login')
    }

    this.currentUser = JSON.parse(localStorage.getItem("currentUser") || '');
    
    this.getUsers()
  }

  async getUsers() {
    if (this.currentUser) {
      const res: any = await this.apiService.get('users');
      this.users = res.filter((user: any) => user._id !== this.currentUser._id);
    } else {
      console.log("Could not find current user");
    }
  }

  sendMessage(): void {
    console.log('Selected ', this.selectedUser, this.currentUser)
    if (this.newMessage.trim() !== '' && this.selectedUser !== null) {
      // Simulate sending message to backend and receiving response
      const newMessage: Message = { 
        sender: this.currentUser, 
        recepient: this.selectedUser,
        _id: (new Date()).getUTCDate(),
        chat: this.newMessage,
        timestamp: new Date(),
      };
      this.messages.push(newMessage);

      // Store updated messages in sessionStorage
      sessionStorage.setItem('messages', JSON.stringify(this.messages));

      this.newMessage = ''; // Clear input field after sending message
    }
  }

  onSelectedUserChanged(){
    if(this.selectedUserId) {
      this.selectedUser = this.users.find((user: User) => user._id === this.selectedUserId) as any;
    } else {
      this.selectedUser = {} as any;
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  indexIsEven(index: any) {
    if (typeof(index) === "number"){
      return (index%2 === 0)
    } else {
      return false
    }
  }
}
