import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthorizationService} from '../authorization.service';
import {RegistrationModalState, LoginPopupState} from '../registration-modal-state.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  resetLinkSend = false;


  forgotPassForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
  });

  constructor(private loginService: AuthorizationService,
              private loginPopupService: RegistrationModalState) { }

  ngOnInit(): void {
  }

  forgotPassword(): void {
    this.forgotPassForm.markAllAsTouched();

    if (this.forgotPassForm.valid) {
      const email = this.forgotPassForm.value.username;
      this.loginService.resetPassword(email).subscribe(() => {
        this.resetLinkSend = true;
      });
    }

  }

  goBack(): void {
    this.loginPopupService.openModal(LoginPopupState.LOGIN_EMAIL);
  }

}
