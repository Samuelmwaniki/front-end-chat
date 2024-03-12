import { Component } from '@angular/core';
import { VerificationService } from './verification/verification.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent {
  verificationCode: string ='';
  verificationError: string='';
  error : string='';
  

  constructor(private verificationService: VerificationService) { }

  verifyUser() {
    this.verificationService.verifyUser(this.verificationCode)
      .subscribe(
        response => {
          // Handle successful verification
          console.log('Verification successful');
        },
        error => {
          // Handle verification error
          this.verificationError = error.message;
        }
      );
  }
}

