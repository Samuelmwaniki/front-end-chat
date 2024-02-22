import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

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
}
