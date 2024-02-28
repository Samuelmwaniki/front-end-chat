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
    //chat end points
    return this.post('/chat', { chat }); 
  }}

//   getUsers(): Observable<any[]> {
//     //hit the endpoint users
//     return this.get('/users');
//   }
// }
