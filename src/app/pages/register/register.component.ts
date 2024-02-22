import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = ''; // Initialize the property with an empty string
  password: string = ''; // Initialize the property with an empty string

  
  constructor() { }

  register() {
    // Implement registration logic here
    console.log('Register submitted');
  }
}
