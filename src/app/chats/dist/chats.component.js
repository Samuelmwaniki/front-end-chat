"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ChatsComponent = void 0;
var core_1 = require("@angular/core");
var ChatsComponent = /** @class */ (function () {
    function ChatsComponent(apiService, router) {
        this.apiService = apiService;
        this.router = router;
        this.messages = [];
        this.newMessage = '';
        this.currentUser = {};
        this.users = [];
        this.selectedUserId = '';
        this.selectedUser = {};
    }
    ChatsComponent.prototype.ngOnInit = function () {
        // Fetch initial messages from sessionStorage when component initializes
        var storedMessages = sessionStorage.getItem('messages');
        if (storedMessages) {
            this.messages = JSON.parse(storedMessages);
        }
        var token = localStorage.getItem("token");
        if (!token) {
            this.router.navigateByUrl('/login');
        }
        this.currentUser = JSON.parse(localStorage.getItem("currentUser") || '');
        this.getUsers();
    };
    ChatsComponent.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.currentUser) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.apiService.get('users')];
                    case 1:
                        res = _a.sent();
                        this.users = res.filter(function (user) { return user._id !== _this.currentUser._id; });
                        return [3 /*break*/, 3];
                    case 2:
                        console.log("Could not find current user");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatsComponent.prototype.sendMessage = function () {
        console.log('Selected ', this.selectedUser, this.currentUser);
        if (this.newMessage.trim() !== '' && this.selectedUser !== null) {
            // Simulate sending message to backend and receiving response
            var newMessage = {
                sender: this.currentUser,
                recepient: this.selectedUser,
                _id: (new Date()).getUTCDate(),
                chat: this.newMessage,
                timestamp: new Date()
            };
            this.messages.push(newMessage);
            // Store updated messages in sessionStorage
            sessionStorage.setItem('messages', JSON.stringify(this.messages));
            this.newMessage = ''; // Clear input field after sending message
        }
    };
    ChatsComponent.prototype.onSelectedUserChanged = function () {
        var _this = this;
        if (this.selectedUserId) {
            this.selectedUser = this.users.find(function (user) { return user._id === _this.selectedUserId; });
        }
        else {
            this.selectedUser = {};
        }
    };
    ChatsComponent.prototype.goToLogin = function () {
        this.router.navigateByUrl('/login');
    };
    ChatsComponent.prototype.indexIsEven = function (index) {
        if (typeof (index) === "number") {
            return (index % 2 === 0);
        }
        else {
            return false;
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
