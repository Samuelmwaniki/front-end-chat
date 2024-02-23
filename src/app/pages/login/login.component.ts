import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
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

  constructor(
     private apiService: ApiService, 
    private router: Router) { }

  async login() {
    // Implement login logic here
    this.loading = true;

    console.log('Login submitted');
    const res = await this.apiService.post('login', { username: this.username, password: this.password} )

    if (res){
      this.router.navigateByUrl(
        '/register'
      )
    }
    // save jwt to localstorage
    this.loading = false;
    
  }
  goToRegister(): void {
    this.router.navigateByUrl('/register');
  }
}

