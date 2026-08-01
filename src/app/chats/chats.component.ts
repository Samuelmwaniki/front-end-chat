import { Component, OnInit, OnDestroy } from '@angular/core';
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
  createdAt?: Date;
  timestamp?: Date;
  read?: boolean;
}

// NEW: shape returned by GET /chats/conversations
interface ConversationPreview {
  userId: string;
  lastMessage: string;
  lastMessageAt: string | Date;
  lastMessageSender: string;
  unreadCount: number;
}

// NEW: shapes returned by the friends endpoints
interface PendingRequest {
  requestId: string;
  fromUserId: string;
  fromUsername: string;
  createdAt: string | Date;
}

interface SentRequest {
  requestId: string;
  toUserId: string;
  toUsername: string;
  createdAt: string | Date;
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})

export class ChatsComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage: string = '';
  currentUser: User = {} as any;
  friends: User[] = [];
  selectedUserId: string = '';
  selectedUser: User = {} as any;

  userSearchTerm: string = '';

  // NEW: friend request state
  pendingRequests: PendingRequest[] = [];
  sentRequests: SentRequest[] = [];
  inviteUsername: string = '';
  inviteError: string = '';
  inviteSuccess: string = '';
  inviteLoading = false;
  showAllRequests = false;
  showManageInvites = false;

  // NEW: online presence — set of userIds currently connected.
  onlineUserIds: Set<string> = new Set();

  // NEW: last-message previews + unread counts, keyed by the other user's id.
  conversations: Map<string, ConversationPreview> = new Map();

  // NEW: typing indicator state
  isRecipientTyping = false;
  private typingTimeout: any = null;

  error:string=''

  constructor(
    private apiService: ApiService,
    private router: Router,
    private webSocketService: WebSocketService
  ) { }

  get filteredFriends(): User[] {
    const term = this.userSearchTerm.trim().toLowerCase();
    const list = term
      ? this.friends.filter(user => user.username.toLowerCase().includes(term))
      : this.friends;

    // Sort by most recent activity — friends you've messaged recently float to the top.
    return [...list].sort((a, b) => {
      const aTime = new Date(this.conversations.get(a._id)?.lastMessageAt || 0).getTime();
      const bTime = new Date(this.conversations.get(b._id)?.lastMessageAt || 0).getTime();
      return bTime - aTime;
    });
  }

  // NEW: template helpers for the sidebar list
  isOnline(userId: string): boolean {
    return this.onlineUserIds.has(userId);
  }

  getLastMessage(userId: string): string {
    return this.conversations.get(userId)?.lastMessage || '';
  }

  getUnreadCount(userId: string): number {
    return this.conversations.get(userId)?.unreadCount || 0;
  }

  async selectUser(user: User) {
    this.selectedUserId = user._id;
    this.isRecipientTyping = false;
    await this.onSelectedUserChanged();
  }

  // NEW: called on every keystroke in the message textarea. Emits
  // 'typing: true' once, then resets a timer that emits 'typing: false'
  // after 2s of no further keystrokes — so we're not spamming an event
  // per character.
  onMessageInput() {
    if (!this.selectedUser._id) {
      return;
    }
    if (!this.typingTimeout) {
      this.webSocketService.emit('typing', {
        senderId: this.currentUser._id,
        recipientId: this.selectedUser._id,
        isTyping: true,
      });
    }
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.webSocketService.emit('typing', {
        senderId: this.currentUser._id,
        recipientId: this.selectedUser._id,
        isTyping: false,
      });
      this.typingTimeout = null;
    }, 2000);
  }

  async sendMessage() {
    console.log("message send");

    if (!this.newMessage.trim()) {
      return;
    }

    this.error = '';

    // Stop signaling "typing" the moment we actually send.
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
      this.webSocketService.emit('typing', {
        senderId: this.currentUser._id,
        recipientId: this.selectedUser._id,
        isTyping: false,
      });
    }

    try {

      const payload = {

        sender: this.currentUser._id,
        recipient: this.selectedUser._id,
        message: this.newMessage,
        createdAt: new Date(),

      };

      console.log('payload', payload);

      const res = await this.apiService.post('chats', payload);

      this.newMessage = '';

    }
    catch (error:any) {

      console.log('Error:', error);

      if (error.response && error.response.status === 400) {

        console.log('STATUS CODE : ', error.response.status);

      }

    }

  }

  async fetchChats() {

    await this.apiService.get('chats/?recipientId='+this.selectedUser._id+'&senderId='+this.currentUser._id)
      .then( ({ data } : any) => {
        this.messages = data;
        console.log('MESSAGES : ', this.messages)
      })
      .catch( () => {

      });
  }

  // NEW: pulls last-message previews + unread counts for the sidebar.
  async fetchConversations() {
    try {
      const res: any = await this.apiService.get('chats/conversations?userId=' + this.currentUser._id);
      const list: ConversationPreview[] = res?.data || res || [];
      this.conversations = new Map(list.map(c => [c.userId, c]));
    } catch (error) {
      console.log('Error fetching conversations:', error);
    }
  }

  // NEW: tells the API the current user has now seen this conversation,
  // and clears the local unread badge immediately (optimistic update).
  async markConversationRead(otherUserId: string) {
    const existing = this.conversations.get(otherUserId);
    if (existing) {
      this.conversations.set(otherUserId, { ...existing, unreadCount: 0 });
    }
    try {
      await this.apiService.post('chats/mark-read', {
        userId: this.currentUser._id,
        otherUserId,
      });
    } catch (error) {
      console.log('Error marking conversation read:', error);
    }
  }

  ngOnInit(): void {
    const storedMessages = sessionStorage.getItem('messages');
    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);
    }

    const token = localStorage.getItem("token");
    if (!token) {

    }

    this.currentUser = JSON.parse(localStorage.getItem("currentUser") || '');

    this.getFriends().then(() => this.fetchConversations());
    this.fetchPendingRequests();
    this.fetchSentRequests();

    // Connect the socket ONCE for the lifetime of this component.
    this.createSocketConnection();
  }

  async ngOnDestroy() {
    try {
      const socket = await this.webSocketService.connect();
      socket.off('message');
      socket.off('userStatus');
      socket.off('onlineUsers');
      socket.off('typing');
      socket.off('messagesRead');
      socket.off('friendRequest');
      socket.off('friendRequestAccepted');
      socket.off('friendRemoved');
    } catch (error) {
      // socket already gone, nothing to clean up
    }
  }

  async getFriends() {
    if (this.currentUser) {
      const res: any = await this.apiService.get('friends?userId=' + this.currentUser._id);
      this.friends = res?.data || res || [];
    } else {
      console.log("Could not find current user");
    }
  }

  // NEW: pending requests sent TO the current user
  async fetchPendingRequests() {
    try {
      const res: any = await this.apiService.get('friends/requests?userId=' + this.currentUser._id);
      this.pendingRequests = res?.data || res || [];
    } catch (error) {
      console.log('Error fetching pending requests:', error);
    }
  }

  // NEW: requests the current user has SENT that are still pending
  async fetchSentRequests() {
    try {
      const res: any = await this.apiService.get('friends/sent?userId=' + this.currentUser._id);
      this.sentRequests = res?.data || res || [];
    } catch (error) {
      console.log('Error fetching sent requests:', error);
    }
  }

  // NEW: send a friend request by username
  async inviteFriend() {
    const username = this.inviteUsername.trim();
    if (!username) {
      return;
    }

    this.inviteError = '';
    this.inviteSuccess = '';
    this.inviteLoading = true;

    try {
      await this.apiService.post('friends/invite', {
        fromUserId: this.currentUser._id,
        username,
      });
      this.inviteSuccess = `Friend request sent to ${username}.`;
      this.inviteUsername = '';
      await this.fetchSentRequests();
    } catch (error: any) {
      this.inviteError = error?.error?.message || error?.message || 'Could not send friend request.';
    } finally {
      this.inviteLoading = false;
    }
  }

  // NEW: accept or decline a request sent to the current user
  async respondToRequest(request: PendingRequest, accept: boolean) {
    try {
      await this.apiService.post('friends/respond', {
        requestId: request.requestId,
        userId: this.currentUser._id,
        accept,
      });
      this.pendingRequests = this.pendingRequests.filter(r => r.requestId !== request.requestId);
      if (accept) {
        await this.getFriends();
      }
    } catch (error) {
      console.log('Error responding to friend request:', error);
    }
  }

  // NEW: cancel a request the current user sent, before it's answered
  async cancelSentRequest(request: SentRequest) {
    try {
      await this.apiService.delete('friends/requests/' + request.requestId + '?userId=' + this.currentUser._id, {});
      this.sentRequests = this.sentRequests.filter(r => r.requestId !== request.requestId);
    } catch (error) {
      console.log('Error cancelling friend request:', error);
    }
  }

  // NEW: removes the currently open friend, with a confirmation prompt
  // since this is destructive. Drops back to the friends hub afterward.
  async unfriendUser() {
    if (!this.selectedUser._id) {
      return;
    }
    const confirmed = window.confirm(`Remove ${this.selectedUser.username} as a friend?`);
    if (!confirmed) {
      return;
    }
    try {
      await this.apiService.delete('friends/' + this.selectedUser._id + '?userId=' + this.currentUser._id, {});
      this.friends = this.friends.filter(f => f._id !== this.selectedUser._id);
      this.conversations.delete(this.selectedUser._id);
      this.openFriendsHub();
    } catch (error) {
      console.log('Error unfriending:', error);
    }
  }

  // NEW: clicking "Add Friend" (or "Manage Invites") should drop back to
  // the friends dashboard even if a conversation is currently open.
  openFriendsHub() {
    this.selectedUserId = '';
    this.selectedUser = {} as any;
  }

  async onSelectedUserChanged(){
    if(this.selectedUserId) {
      this.selectedUser = this.friends.find((user: User) => user._id === this.selectedUserId) as any;

      console.log('USER CHANGED')
      await this.fetchChats();
      // NEW: opening a conversation clears its unread badge.
      await this.markConversationRead(this.selectedUserId);
    } else {
      this.selectedUser = {} as any;
    }
  }

  async createSocketConnection()
  {
    try {
      const socket = await this.webSocketService.connect();

      // Defensive: never stack listeners on a reused socket instance.
      socket.off('message');
      socket.off('userStatus');
      socket.off('onlineUsers');

      socket.off('typing');
      socket.off('messagesRead');
      socket.off('friendRequest');
      socket.off('friendRequestAccepted');
      socket.off('friendRemoved');
      socket.on('message', (message: any) => {
          this.handleSocketMessage(message)
      });

      // NEW: presence events
      socket.on('userStatus', (payload: { userId: string; online: boolean }) => {
        if (payload.online) {
          this.onlineUserIds.add(payload.userId);
        } else {
          this.onlineUserIds.delete(payload.userId);
        }
      });

      socket.on('onlineUsers', (userIds: string[]) => {
        this.onlineUserIds = new Set(userIds);
      });

      // NEW: typing indicator — only relevant if it's from whoever we
      // currently have open.
      socket.on('typing', (payload: { senderId: string; isTyping: boolean }) => {
        if (payload.senderId === this.selectedUser._id) {
          this.isRecipientTyping = payload.isTyping;
        }
      });

      // NEW: read receipts — the other side just read our messages to
      // them. If that's the conversation we currently have open, flip
      // our sent messages to read=true so "Seen" shows up.
      socket.on('messagesRead', (payload: { readerId: string }) => {
        if (payload.readerId === this.selectedUser._id) {
          this.messages = this.messages.map(m =>
            m.sender === this.currentUser._id ? { ...m, read: true } : m
          );
        }
      });

      // NEW: someone just sent us a friend request — refresh the pending list.
      socket.on('friendRequest', () => {
        this.fetchPendingRequests();
      });

      // NEW: someone accepted our friend request — refresh friends + sent list.
      socket.on('friendRequestAccepted', () => {
        this.getFriends();
        this.fetchSentRequests();
      });

      // NEW: someone removed us as a friend — drop them from our list too,
      // and back out of the conversation if it was open.
      socket.on('friendRemoved', (payload: { userId: string }) => {
        this.friends = this.friends.filter(f => f._id !== payload.userId);
        this.conversations.delete(payload.userId);
        if (this.selectedUserId === payload.userId) {
          this.openFriendsHub();
        }
      });

      // NEW: tell the gateway who we are, now that the socket is open.
      if (this.currentUser?._id) {
        this.webSocketService.identify(this.currentUser._id);
      }
    }catch (error) {
      console.error("error establishing websocket")
    }
  }

  handleSocketMessage(message: any) {
    const isForOpenConversation =
      (message.recipient === this.currentUser._id && message.sender === this.selectedUser._id) ||
      (message.recipient === this.selectedUser._id && message.sender === this.currentUser._id);

    if (message && isForOpenConversation) {
      this.messages.push(message);

      // If it's an incoming message for the conversation we already have
      // open, mark it read right away instead of letting a badge appear.
      if (message.recipient === this.currentUser._id) {
        this.markConversationRead(message.sender);
      }
    }

    // NEW: keep the sidebar preview + unread badge in sync for ANY
    // message involving the current user, whether or not that
    // conversation is currently open.
    if (message && (message.sender === this.currentUser._id || message.recipient === this.currentUser._id)) {
      const otherUserId = message.sender === this.currentUser._id ? message.recipient : message.sender;
      const existing = this.conversations.get(otherUserId);
      const isIncomingToOpenConvo = isForOpenConversation && message.recipient === this.currentUser._id;

      this.conversations.set(otherUserId, {
        userId: otherUserId,
        lastMessage: message.message,
        lastMessageAt: message.createdAt || new Date(),
        lastMessageSender: message.sender,
        unreadCount: isIncomingToOpenConvo
          ? 0
          : (message.recipient === this.currentUser._id ? (existing?.unreadCount || 0) + 1 : (existing?.unreadCount || 0)),
      });
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