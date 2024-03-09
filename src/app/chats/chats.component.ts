import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { WebSocketService } from '../services/web-socket.service';

interface User {
  _id: string;
  username: string;
}

interface Message {
  
  _id: number;
  sender: string;
  recipient: string;
  message: string;
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
 
 
  error:string=''

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private webSocketService: WebSocketService 
  ) { }
  async sendMessage() {
    console.log("message send");

    this.error = '';

    try {

      const payload = {

        sender: this.currentUser._id,
        recipient: this.selectedUser._id,
        message: this.newMessage,
        createdAt: new Date(),

      };

      console.log('payload', payload);

      const res = await this.apiService.post('chats', payload);

      // if (res) {
      //   return await this.fetchChats();

      // }

    } 
    catch (error:any) {

      console.log('Error:', error);

      if (error.response && error.response.status === 400) {
        
        console.log('STATUS CODE : ', error.response.status);

        // handle 400 status code error
        
      }

    }

  }

  // fetch chats from the database 

  async fetchChats() {

    await this.apiService.get('chats/?recipientId='+this.selectedUser._id+'&senderId='+this.currentUser._id)
      .then( ({ data } : any) => {
        this.messages = data;
        console.log('MESSAGES : ', this.messages)
      })
      .catch( () => {
        
      });
  }



  ngOnInit(): void {
    // Fetch initial messages from sessionStorage when component initializes
    const storedMessages = sessionStorage.getItem('messages');
    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      
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

  // sendMesssage(): void {
  //   console.log('Selected ', this.selectedUser, this.currentUser)
  //   if (this.newMessage.trim() !== '' && this.selectedUser !== null) {
  //     // Simulate sending message to backend and receiving response
  //     const newMessage: Message = { 
  //       sender: this.currentUser, 
  //       recepient: this.selectedUser,
  //       _id: (new Date()).getUTCDate(),
  //       chat: this.newMessage,
  //       timestamp: new Date(),
  //     };
  //     this.messages.push(newMessage);

  //     // Store updated messages in sessionStorage
  //     sessionStorage.setItem('messages', JSON.stringify(this.messages));

  //     this.newMessage = ''; // Clear input field after sending message
  //   }
  // }

  async onSelectedUserChanged(){
    if(this.selectedUserId) {
      this.selectedUser = this.users.find((user: User) => user._id === this.selectedUserId) as any;

      console.log('USER CHANGED')
      await this.createSocketConnection();
      await this.fetchChats();
    } else {
      this.selectedUser = {} as any;
    }
  }

  async createSocketConnection()
  {
    try {
      const socket = await this.webSocketService.connect();
      
      socket.on('message', (message: any) => {
          this.handleSocketMessage(message)
      });
    }catch (error) {
      console.error("error establishing websocket")
    }
  }
  
  handleSocketMessage(message: any) {
    if(message &&(( message.recipient === this.currentUser._id && message.sender === this.selectedUser._id) || ( message.recipient === this.selectedUser._id && message.sender === this.currentUser._id))) {
      this.messages.push(message)
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
    }}
    
  }


