import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular'; // Import IonicModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http.service';
import { ApiService } from './services/api.service';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatsComponent } from './chats/chats.component';
import { WebSocketService } from './services/web-socket.service'; // Import WebSocketService
@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent,ChatsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule], // Add IonicModule here
  providers: [HttpService, ApiService,WebSocketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
