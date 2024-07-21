import {Component, Input} from '@angular/core';
import {WalletLoginButtonService, WalletLoginDetails} from './wallet-login-button.service';
import {AuthorizationService} from '../authorization.service';
import {RouterService} from '../../../_core/services/router.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SingUpService} from './sing-up.service';
import {CurrentUserState} from '../../../_core/services/current-user-state.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {LoginPopupState, RegistrationModalState} from '../registration-modal-state.service';
import de from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/de";

@Component({
    selector: 'app-wallet-login',
    templateUrl: './wallet-login-button.component.html',
    styleUrls: ['./wallet-login-button.component.scss']
})
export class WalletLoginButtonComponent {

    @Input()
    mode: WalletLoginButtonType = 'button';
    @Input()
    action: 'signup' | 'login' = 'login';
    @Input()
    invitationCode: string;

    constructor(private walletLoginButtonService: WalletLoginButtonService,
                private snackBar: MatSnackBar,
                public mob: DeviceDetectorService,
                private signUpService: SingUpService,
                private modalService: RegistrationModalState,
                private currentUserService: CurrentUserState,
                private loginService: AuthorizationService,
                private routerService: RouterService) {
    }

    logIn(): void {
        this.routerService.navigateToSocialLogin();
    }

    walletLogin(): void {
        this.walletLoginButtonService.walletAuthorization(this.action, this.invitationCode).then((res: WalletLoginDetails) => {
            if (res.error) {
                this.loginService.walletLogout();
                if (res.error !== 'user-cancel') {
                    const page = this.action === 'login' ? LoginPopupState.LOGIN : LoginPopupState.CREATE_ACCOUNT;
                    this.modalService.openModal(page, {error: true, errorMessage: res.error});
                }
            } else {
                this.loginService.handleAfterWalletLogIn(res.walletAddress, res.authToken.wToken, res.authToken.gToken).subscribe(() => {
                    this.loginService.handleAfterLoginRedirects();
                });
            }
        });
    }


    async phantomLogin(): Promise<void> {
        const getProvider = () => {
            if ('phantom' in window) {
                // @ts-ignore
                const provider = window.phantom?.solana;

                if (provider?.isPhantom) {
                    return provider;
                }
            }

            window.open('https://phantom.app/', '_blank');
        };
        // Check if Phantom is installed
        // @ts-ignore
        if (window.solana && window.solana.isPhantom) {
            const provider = getProvider(); // see "Detecting the Provider"
            try {
                const resp = await provider.connect();
                console.log(resp.publicKey.toString());
                const user = resp.publicKey.toString();

                const message = `Sign in in Solstream!`;
                const encodedMessage = new TextEncoder().encode(message);
                const signedMessage = await provider.signMessage(encodedMessage, 'utf8');

                const userProfile = await this.getAuthTokens(user);
                this.loginService.handleAfterWalletLogIn(user, userProfile.wToken, userProfile.gToken).subscribe(() => {
                    this.loginService.handleAfterLoginRedirects();
                });
            } catch (err) {
                // { code: 4001, message: 'User rejected the request.' }
            }
        } else {
            // Phantom Wallet is not installed
            console.log('Phantom wallet is not installed.');
            // Optionally, prompt the user to install Phantom or choose another wallet
        }
    }

// Example helper function to simulate fetching auth tokens for a wallet address
// You would replace this with your actual method to get tokens
    getAuthTokens(walletAddress): Promise<{wToken: string, gToken: string, error?: string}> {
        // Simulated fetch request to your auth server
        // Replace this with your actual fetch request
        return new Promise((resolve, reject) => {
            // Simulate successful fetch
            resolve({ wToken: 'exampleWToken', gToken: 'exampleGToken' });
            // Simulate fetch error
            // resolve({ error: 'Failed to fetch tokens' });
        });
    }

    // private loginWithWalletAddress(userName: string, wToken: string): void {
    //     this.loginService.logIn(userName, userName, wToken, true)
    //         .pipe(
    //             mergeMap(() => this.currentUserService.fetchCurrentUserData()))
    //         .subscribe(() => {
    //             this.loadCurrentUserData();
    //         }, (e) => {
    //             if (e.status === 403) {
    //                 this.signUpService.signUp({username: userName, password: userName})
    //                     .pipe(
    //                         mergeMap(() => this.loginService.logIn(userName, userName, wToken, true)),
    //                         mergeMap(() => this.currentUserService.fetchCurrentUserData()))
    //                     .subscribe(() => {
    //                         this.loadCurrentUserData();
    //                     }, () => {
    //                         this.showErrorBar();
    //                     });
    //             } else {
    //                 this.showErrorBar();
    //             }
    //         });
    // }

    private showErrorBar(): void {
        this.snackBar.open('Service unavailable, please try again later.', 'Close');
    }


    // TODO to service

}

export type WalletLoginButtonType = 'button' | 'icon';
