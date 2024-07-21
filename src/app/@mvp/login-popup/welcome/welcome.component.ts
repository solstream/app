import {Component, OnInit} from '@angular/core';
import {RegistrationModalState, LoginPopupState} from '../registration-modal-state.service';
import {RouterService} from '../../../_core/services/router.service';

@Component({
    selector: 'app-register-modal-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class LoginPopupWelcomeComponent implements OnInit {

    constructor(private loginPopupService: RegistrationModalState, private routerService: RouterService) {
    }

    ngOnInit(): void {
    }

    createAccount(): void {
        this.loginPopupService.openModal(LoginPopupState.CREATE_ACCOUNT);
    }

    explainMeMore(): void {
        this.loginPopupService.openModal(LoginPopupState.CLOSE);
        this.routerService.goToHowToEarn();
    }

    login(): void {
        this.loginPopupService.openModal(LoginPopupState.LOGIN);
    }

}
