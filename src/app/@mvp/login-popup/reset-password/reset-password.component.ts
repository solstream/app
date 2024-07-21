import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SingUpService} from '../email-sign-up/sing-up.service';
import {RouterService} from '../../../_core/services/router.service';
import {validationMessages} from '../../../_core/constants/validations';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

    @Input() token;
    public validations = validationMessages;
    public samePassword;
    public error: ResetError;
    public resetPasswordFrom = new FormGroup({
        password: new FormControl('', Validators.compose([Validators.minLength(4), Validators.required])),
        password2: new FormControl('', Validators.compose([Validators.minLength(4), Validators.required])),
    });

    constructor(private singUpService: SingUpService, private routerService: RouterService) {
    }

    ngOnInit(): void {

    }

    resetPassword(): void {
        this.resetPasswordFrom.markAllAsTouched();
        if (this.resetPasswordFrom.valid && this.isSamePassword()) {
            this.singUpService.resetPass(this.token, this.resetPasswordFrom.value.password).subscribe(() => {
                this.routerService.navigateToEmailLogin();
            }, e => this.error = 'other');
        }
    }

    isSamePassword(): boolean {
        this.samePassword = this.resetPasswordFrom.get('password').value === this.resetPasswordFrom.get('password2').value;
        return this.samePassword;
    }

}

type ResetError = 'other';
