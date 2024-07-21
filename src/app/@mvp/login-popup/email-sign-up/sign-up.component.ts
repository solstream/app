import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmailSignupRequest, SingUpService} from './sing-up.service';
import {RouterService} from '../../../_core/services/router.service';
import {RegistrationModalState, LoginPopupState} from '../registration-modal-state.service';
import {validationMessages, validationsPattern} from '../../../_core/constants/validations';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html'
})
export class SignUpComponent {

    public validations = validationMessages;
    public samePassword;

    @Input()
    invitationCode: string;

    signUpForm = new FormGroup({
        email: new FormControl('', [Validators.pattern(validationsPattern.email), Validators.required]),
        password: new FormControl('', Validators.required),
        password2: new FormControl('', Validators.required),
    });

    error: SignUpError;

    constructor(
        private singUpService: SingUpService,
        private routerService: RouterService,
        private loginPopupService: RegistrationModalState) {
    }

    signUp(): void {
        this.signUpForm.markAllAsTouched();
        if (this.signUpForm.valid && this.isSamePassword()) {
            const req = {
                username: this.signUpForm.value.email,
                password: this.signUpForm.value.password,
                invitationCode: this.invitationCode
            } as EmailSignupRequest;
            this.singUpService.signUp(req).subscribe(() => {
                this.loginPopupService.openModal(LoginPopupState.LOGIN_EMAIL);
            }, (e) => {
                this.error = e.status === 409 ? 'user-exists' : 'other';
            });
        }
    }

    goBack(): void {
        this.loginPopupService.openModal(LoginPopupState.CREATE_ACCOUNT);
    }

    isSamePassword(): boolean {
        this.samePassword = this.signUpForm.get('password').value === this.signUpForm.get('password2').value;
        return this.samePassword;
    }

}

type SignUpError = 'user-exists' | 'other';
