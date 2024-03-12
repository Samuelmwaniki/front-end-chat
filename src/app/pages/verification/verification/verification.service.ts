import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private verificationUrl = 'http://3000/verification'; // Update with your actual API URL

  constructor(private http: HttpClient) { }

  verifyUser(verificationCode: string): Observable<any> {
    return this.http.post<any>(this.verificationUrl, { code: verificationCode });
  }
}
