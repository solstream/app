import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {RouterService} from '../../../_core/services/router.service';
import {ActivatedRoute} from '@angular/router';
import {AuthorizationService} from '../authorization.service';
import {CurrentUserState} from '../../../_core/services/current-user-state.service';
import {LocalStorageService} from '../../../_core/services/auth-store.service';
import {RegistrationModalState, LoginPopupState} from '../registration-modal-state.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {validationMessages, validationsPattern} from '../../../_core/constants/validations';
import {invitationCodes} from '../../../_core/constants/invitationCodes';
import {of} from 'rxjs';

@Component({
    selector: 'app-login-popup-login',
    templateUrl: './login.component.html'
})
export class LoginPopupLoginComponent implements OnInit {
    public validations = validationMessages;
    loggedIn = false;
    forgotPass = false;
    loginType: LoginType;
    inProgress = false;
    user: any;

    @Input()
    errorMessage: string;

    constructor(
        private authService: SocialAuthService,
        private client: HttpClient,
        private routerService: RouterService,
        private route: ActivatedRoute,
        private loginService: AuthorizationService,
        private modalState: RegistrationModalState,
        private cus: CurrentUserState,
        private localStorage: LocalStorageService,
        private authModal: RegistrationModalState
    ) {
    }

    ngOnInit(): void {
        // this.route.queryParams.subscribe(params => {
        //     if (params.oauth_token && params.oauth_verifier) {
        //         this.loginService.twAccessToken(params.oauth_token, params.oauth_verifier).subscribe((rez) => {
        //         });
        //     }
        // });

        this.authService.authState.subscribe((user) => {
            this.inProgress = true;
            this.user = user;
            this.loggedIn = (user != null);
            if (this.loggedIn) {
                const headers = new HttpHeaders().set('Content-Type', 'application/json');
                this.client.post(environment.privateAzure + '/social-login',
                    {authToken: user.authToken, idToken: user.idToken, loginType: this.loginType},
                    {headers, responseType: 'text'})
                    .pipe(
                        tap(resp => this.localStorage.setPTVToke(resp as string)),
                        tap(() => this.localStorage.setUserName(user.email)),
                        tap(() => this.localStorage.setIsWallet(false)),
                        catchError(() => of(null)))
                    .subscribe((token) => {
                        if (token === null) {
                            this.authService.signOut().then(() => console.log('singed out'));
                            this.errorMessage = 'User doesn\'t exist please create and account.';
                            return;
                        }
                        this.cus.fetchCurrentUserData().subscribe(() => {
                            this.authModal.closeModal();
                            this.routerService.navigateToMyTv(this.cus.getAccountName());
                        });

                    });
            }
        });
    }

    signInWithFB(): void {
        this.loginType = 'fb';
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    loginWithGoogle(): void {
        this.loginType = 'gmail';
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signInWithTwitter(): void {
        this.loginType = 'gmail';
        this.loginService.twitterLogin().subscribe((loginUrl) => {
            window.location.href = loginUrl;
        });
    }

    registerViaMail(): void {
        this.authModal.openModal(LoginPopupState.REGISTER_EMAIL);
    }

    signInWithEmail(): void {
        this.authModal.openModal(LoginPopupState.LOGIN_EMAIL);
    }

}

export type LoginType = 'fb' | 'gmail';
