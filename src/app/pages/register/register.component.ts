import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  onOtpChange($event: string) {
    throw new Error('Method not implemented.');
  }
  firstname: string = '';
  lastname: string = '';
  username: string = '';
  password: string = '';
  resetEmail: string = '';
  loading = false;
  error: string = '';
  errorMessage: any = [];
  showPassword = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async register() {
    this.loading = true;
    this.error = ''; // Clear any previous errors
    this.errorMessage = [];

    try {
      const res = await this.apiService.post('users/register', {
        firstname: this.firstname,
        lastname: this.lastname,
        username: this.username,
        password: this.password,
      });

      if (res) {
        // Save user data to localStorage
        const userData = {
          firstname: this.firstname,
          lastname: this.lastname,
          username: this.username,
          password: this.password,
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        await this.showToast('Account created successfully!', 'success');

        // Redirect to login page after successful registration
        this.router.navigateByUrl('users/login');
      }
    } catch (response: any) {
      console.log('STATUS CODE : ', response.error);
      if (response.error?.statusCode === 400) {
        this.errorMessage = response.error.message;
      }
      console.log('ERRORS : ', this.errorMessage);

      if (this.userAlreadyExists(this.errorMessage)) {
        this.error = 'An account with this username already exists.';
        await this.showToast('This user already exists.', 'error');
      } else {
        this.error = Array.isArray(this.errorMessage)
          ? this.errorMessage.join(' ')
          : this.errorMessage || 'Something went wrong. Please try again.';
        await this.showToast('Registration failed. Please try again.', 'error');
      }
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  resetPassword() {}

  // Checks the API's error message(s) for an "already exists" style response.
  // errorMessage can come back as a single string or an array of strings
  // (e.g. NestJS validation errors) depending on your backend, so handle both.
  private userAlreadyExists(errorMessage: any): boolean {
    const text = Array.isArray(errorMessage)
      ? errorMessage.join(' ').toLowerCase()
      : String(errorMessage || '').toLowerCase();
    return text.includes('exist');
  }

  private async showToast(message: string, kind: 'success' | 'error') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'top',
      color: kind === 'success' ? 'success' : 'danger',
    });
    await toast.present();
  }
}