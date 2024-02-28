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
  loading = true;
  error: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  async register() {
    this.loading = true;
    this.error = ''; // Clear any previous errors

    try {
      const res = await this.apiService.post('users/register', {
        firstname: this.firstname,
        lastname: this.lastname,
        username: this.username,
        password: this.password,
        
      });

      // Check if registration was successful
      if (res) {
        // Save user data to localStorage
        const userData = {
          firstname: this.firstname,
         lastname: this.lastname,
          username: this.username,
          password: this.password,
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Redirect to login page after successful registration
        this.router.navigateByUrl('users/login');
      }
    } catch (error:any) {
      this.error = error.message || 'An error occurred during registration.';
   //console.error('Error during registration:', error.message);
    } finally {
      this.loading = false;
    }
  }

 goToLogin() {
    this.router.navigateByUrl('/login');
  }
}