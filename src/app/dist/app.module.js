"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var angular_1 = require("@ionic/angular"); // Import IonicModule
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var http_1 = require("@angular/common/http");
var http_service_1 = require("./services/http.service");
var api_service_1 = require("./services/api.service");
var login_component_1 = require("./pages/login/login.component");
var register_component_1 = require("./pages/register/register.component");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var chats_component_1 = require("./chats/chats.component");
var web_socket_service_1 = require("./services/web-socket.service"); // Import WebSocketService
var ng_otp_input_1 = require("ng-otp-input");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [app_component_1.AppComponent, login_component_1.LoginComponent, register_component_1.RegisterComponent, chats_component_1.ChatsComponent],
            imports: [common_1.CommonModule, ng_otp_input_1.NgOtpInputModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, http_1.HttpClientModule, platform_browser_1.BrowserModule, angular_1.IonicModule.forRoot(), app_routing_module_1.AppRoutingModule],
            providers: [http_service_1.HttpService, api_service_1.ApiService, web_socket_service_1.webSocketService],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
