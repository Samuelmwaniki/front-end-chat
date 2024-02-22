import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
