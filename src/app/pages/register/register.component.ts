import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  firstname: string = '';
  lastname: string = '';
  username: string = '';
  password: string = '';
  loading = false;
  error: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  async register() {
    this.loading = true;
    this.error = ''; // Clear any previous errors

    try {
      const res = await this.apiService.post('users/register', {
        //firstname: this.firstname,
       // lastname: this.lastname,
        username: this.username,
        password: this.password,
      });

      if (res) {
        this.router.navigateByUrl('users/login');
      }
    } catch (error:any) {
      this.error = error.message || 'An error occurred during registration.';
    } finally {
      this.loading = false;
    }
  }
}
