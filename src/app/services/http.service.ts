import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
public baseUrl: string = '';
public token: string = '';
protected httpClient: HttpClient;

  constructor() { 
    this.httpClient = inject(HttpClient)
  }

async get(url: string) {
  return await this.request(url, 'GET', {})
}
async  post(url: string, body: any) {
  return await this.request(url, 'POST', body)
}
async  patch(url: string, body: any) {
  return await this.request(url, "PATCH", body)
}
async  delete(url: string, body: any){
  return await this.request(url, "DELETE", body)
}

async request(reqUrl: string, method: string, body: any) {

  const url = this.baseUrl + "/" + reqUrl;
  let headers = new HttpHeaders();
  headers.set('Content-Type', 'application/json; charset=utf-8');
  if (this.token){
    headers.set('Authorization', 'Bearer ' + this.token)
  }
  const reqOpt = { headers, body}
  try {
    const res = await this.httpClient.request(method, url, reqOpt ).toPromise()
    return res;
  } catch (error: any) {
    console.log(error.message)
    throw error;
  }
}
  
}
