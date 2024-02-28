"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChatsComponent = void 0;
var core_1 = require("@angular/core");
var ChatsComponent = /** @class */ (function () {
    function ChatsComponent(apiService) {
        this.apiService = apiService;
        this.messages = [];
        this.newMessage = '';
        this.users = [];
        this.selectedUser = null;
    }
    ChatsComponent.prototype.ngOnInit = function () {
        // Fetch initial messages from sessionStorage when component initializes
        var storedMessages = sessionStorage.getItem('messages');
        if (storedMessages) {
            this.messages = JSON.parse(storedMessages);
        }
        // Fetch users for dropdown menu
        //   this.apiService.getUsers().subscribe((users: User[]) => {
        //     this.users = users;
        //   });
        // }
    };
    ChatsComponent.prototype.sendMessage = function () {
        if (this.newMessage.trim() !== '' && this.selectedUser !== null) {
            // Simulate sending message to backend and receiving response
            var newMessage = { sender: 'Me', content: this.newMessage };
            this.messages.push(newMessage);
            // Store updated messages in sessionStorage
            sessionStorage.setItem('messages', JSON.stringify(this.messages));
            this.newMessage = ''; // Clear input field after sending message
        }
    };
    ChatsComponent = __decorate([
        core_1.Component({
            selector: 'app-chats',
            templateUrl: './chats.component.html',
            styleUrls: ['./chats.component.scss']
        })
    ], ChatsComponent);
    return ChatsComponent;
}());
exports.ChatsComponent = ChatsComponent;
