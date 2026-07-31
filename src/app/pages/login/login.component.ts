import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading = false;
  error: string = '';

  // new — needed by the updated template
  mode: 'signin' | 'signup' = 'signin';
  showPassword = false;
  rememberMe = false;

  constructor(private apiService: ApiService, private router: Router) {}

  async login() {
    this.loading = true;
    this.error = ''; // Clear any previous errors

    try {
      const res: any = await this.apiService.post('users/login', { username: this.username, password: this.password });
      console.log('res: ', res)

      if (res) {

        localStorage.setItem('currentUser', JSON.stringify(res.user))
        localStorage.setItem('token', res.token);
        // Redirect to chat page after successful login

        this.router.navigateByUrl('/chat');
      }
    } catch (error) {
      this.error = 'Invalid username or password. Please try again.'; // Set error message for wrong credentials
    } finally {
      this.loading = false;
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  loginWithGoogle() {
    // TODO: wire up your Google auth flow
  }

  loginWithFacebook() {
    // TODO: wire up your Facebook auth flow
  }

  loginWithApple() {
    // TODO: wire up your Apple auth flow
  }
}