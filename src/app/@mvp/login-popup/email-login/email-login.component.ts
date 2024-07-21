import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthorizationService} from '../authorization.service';
import {RouterService} from '../../../_core/services/router.service';
import {RegistrationModalState, LoginPopupState} from '../registration-modal-state.service';
import {validationMessages, validationsPattern} from '../../../_core/constants/validations';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html'
})
export class EmailLoginComponent implements OnInit {

  public validations = validationMessages;
  public error: LoginError;

  codeForm = new FormGroup({
    username: new FormControl('', [Validators.pattern(validationsPattern.email), Validators.required]),
    password: new FormControl('', Validators.required),
  });

  constructor(
      private loginService: AuthorizationService,
      private routerService: RouterService,
      private loginPopupService: RegistrationModalState
  ) { }

  ngOnInit(): void {
  }

  userNameLogin(): void {
    this.codeForm.markAllAsTouched();

    if (this.codeForm.valid) {
      const username = this.codeForm.getRawValue().username;
      const password = this.codeForm.getRawValue().password;
      this.loginService.logIn(username, password, 'none').subscribe(() => {
            this.routerService.navigateHome();
            this.loginPopupService.closeModal();
          }, error => this.error = error.status === 403 ? 'incorrect-credentials' : 'other'
      );
    }
  }

  forgotPassword(): void {
    this.loginPopupService.openModal(LoginPopupState.FORGOT_PASSWORD);
  }

  goBack(): void {
    this.loginPopupService.openModal(LoginPopupState.LOGIN);
  }

}

type LoginError = 'incorrect-credentials' | 'other';
