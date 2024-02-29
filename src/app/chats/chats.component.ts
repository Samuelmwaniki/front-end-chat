import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

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

  constructor(private apiService: ApiService, private router:Router) { }

  ngOnInit(): void {
    // Fetch initial messages from sessionStorage when component initializes
    const storedMessages = sessionStorage.getItem('messages');
    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);
    }

    const token = localStorage.getItem("token");
    if (!token){
      this.router.navigateByUrl('/login')
    }

    // Fetch users for dropdown menu
  //   this.apiService.getUsers().subscribe((users: User[]) => {
  //     this.users = users;
  
  //   });
  // }
    const user = localStorage.getItem("currentUser")
    if (user){
        this.getUsers(user)
    }

  
  }

 async getUsers(user: string){
  const currentUser = JSON.parse(user);
   const res: any = await this.apiService.get('users');
   console.log('users: ', res)
    this.users = res.filter((user: any) => user._id !== currentUser._id)
    console.log('users 2: ', this.users)
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
