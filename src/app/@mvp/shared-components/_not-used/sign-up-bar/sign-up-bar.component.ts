import {Component, Inject, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeviceDetectorService} from 'ngx-device-detector';
import {mergeMap} from 'rxjs/operators';
import {LocalStorageService} from 'src/app/_core/services/auth-store.service';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';
import {AuthorizationService} from '../../../login-popup/authorization.service';
import {WalletLoginButtonService} from '../../../login-popup/wallet-login/wallet-login-button.service';
import {SingUpService} from '../../../login-popup/wallet-login/sing-up.service';
import {RouterService} from '../../../../_core/services/router.service';
import {sign} from 'crypto';

@Component({
    selector: 'app-sign-up-bar',
    templateUrl: './sign-up-bar.component.html',
    styleUrls: ['./sign-up-bar.component.scss']
})
export class SignUpBarComponent implements OnInit {

    showSignUpBar = false;

    constructor(private authStore: LocalStorageService,
                private metaMaskService: WalletLoginButtonService,
                private signUpService: SingUpService,
                private snackBar: MatSnackBar,
                private currentUserService: CurrentUserState,
                private loginService: AuthorizationService,
                private routerService: RouterService,
                public mob: DeviceDetectorService) {
    }

    ngOnInit(): void {
        const userName = this.authStore.getSecurityUserName();
        this.showSignUpBar = !userName;
    }

    walletSignup(): void {
        this.metaMaskService.walletAuthorization('signup').then((res) => {
            if (res.error) {
                this.loginService.walletLogout();
            } else {
                this.loginService.handleAfterWalletLogIn(res.walletAddress, res.authToken.wToken, res.authToken.gToken).subscribe(() => {
                    this.loginService.handleAfterLoginRedirects();
                });
            }
        });
    }

    // private signUpWithWalletAddress(userName: string, wToken: string): void {
    //     this.loginService.logIn(userName, userName, wToken, true)
    //         .pipe(
    //             mergeMap(() => this.currentUserService.fetchCurrentUserData()))
    //         .subscribe(() => {
    //             this.navigateToTheApp();
    //         }, (e) => {
    //             if (e.status === 403) {
    //                 this.signUpService.signUp({username: userName, password: userName})
    //                     .pipe(
    //                         mergeMap(() => this.loginService.logIn(userName, userName, wToken, true)),
    //                         mergeMap(() => this.currentUserService.fetchCurrentUserData()))
    //                     .subscribe(() => {
    //                         this.navigateToTheApp();
    //                     }, () => {
    //                         this.showErrorBar();
    //                     });
    //             } else {
    //                 this.showErrorBar();
    //             }
    //         });
    // }

    // private navigateToTheApp(): void {
    //     const userRoom = this.currentUserService.getCurrentUserRoom();
    //     if (userRoom) {
    //         this.routerService.navigateToEditableRoom(userRoom.roomName);
    //         return;
    //     }
    //     this.routerService.navigateToNewRoom();
    // }

    // private showErrorBar(): void {
    //     this.snackBar.open('Service unavailable, please try again later.', 'Close');
    // }

}
