import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends HttpService {

  constructor() {
    super();
    this.baseUrl = environment.serverUrl;
    const token = localStorage.getItem('token')
    this.token = token || "";
   }

  sendMessage(chat: string) {
    // Assuming you're using an HTTP POST request to send the message
    // Adjust the endpoint URL and request body structure according to your API
    return this.post('/chat', { chat }); // This line is likely causing the error
  }
}
