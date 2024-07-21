import {Component, OnDestroy, OnInit} from '@angular/core';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {debounce, filter, map, mergeMap, tap} from 'rxjs/operators';
import {RouterService} from '../../../_core/services/router.service';
import {ActivatedRoute} from '@angular/router';
import {AuthorizationService} from '../authorization.service';
import {CurrentUserState} from '../../../_core/services/current-user-state.service';
import {LocalStorageService} from '../../../_core/services/auth-store.service';
import {LoginPopupState, RegistrationModalState} from '../registration-modal-state.service';
import {LoginType} from '../login/login.component';
import {FormControl, FormGroup} from '@angular/forms';
import {timer} from 'rxjs';
import {SocialUser} from 'angularx-social-login/entities/social-user';

@Component({
    selector: 'app-register-modal-create-account',
    templateUrl: './create-an-account.component.html'
})
export class LoginPopupCreateAccountComponent implements OnInit, OnDestroy {
    private gmAuthSubs = null;
    private invCodeSubs = null;

    private loginType: LoginType;

    private socialLoginInProgress = false;
    private socialUser: SocialUser;

    invitationCode: string;
    codeCorrect = false;

    invitationForm = new FormGroup({
        invitationCode: new FormControl(''),
    });

    constructor(
        private socialAuthService: SocialAuthService,
        private authService: AuthorizationService,
        private client: HttpClient,
        private routerService: RouterService,
        private route: ActivatedRoute,
        private cus: CurrentUserState,
        private localStorage: LocalStorageService,
        private authModalState: RegistrationModalState
    ) {
    }


    ngOnInit(): void {
        // this.route.queryParams.subscribe(params => {
        //   if (params.oauth_token && params.oauth_verifier) {
        //     this.loginService.twAccessToken(params.oauth_token, params.oauth_verifier).subscribe((rez) => {
        //     });
        //   }
        // });
        this.invCodeSubs = this.invitationForm.valueChanges.pipe(
            debounce(() => timer(500)),
            map(val => val?.invitationCode),
            filter(val => val?.length > 5),
            // tap(val => this.invitationCode = val),
            mergeMap(code => this.authService.isInvitationCodeValid(code))
        ).subscribe(isValid => {
            this.codeCorrect = isValid;
            this.invitationCode = this.invitationForm.get('invitationCode').value;
        });

        this.gmAuthSubs = this.socialAuthService.authState.subscribe((user) => {
            this.socialLoginInProgress = true;
            this.socialUser = user;
            if (this.socialUser) {
                const headers = new HttpHeaders().set('Content-Type', 'application/json');
                const req = {
                    authToken: user.authToken,
                    idToken: user.idToken,
                    loginType: this.loginType,
                    invitationCode: this.invitationCode,
                } as SocialSignupRequest;
                this.client.post(environment.privateAzure + '/social-sign-up', req, {headers, responseType: 'text'})
                    .pipe(
                        tap(resp => this.localStorage.setPTVToke(resp as string)),
                        tap(() => this.localStorage.setUserName(user.email)),
                        tap(() => this.localStorage.setIsWallet(false))
                    ).subscribe((token) => {
                    this.cus.fetchCurrentUserData().subscribe(() => {
                        this.authModalState.closeModal();
                        this.routerService.navigateToMyTv(this.cus.getAccountName());
                    });

                });
            }
        });
    }

    signInWithFB(): void {
        this.loginType = 'fb';
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    signInWithGoogle(): void {
        this.loginType = 'gmail';
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signInWithTwitter(): void {
        this.loginType = 'gmail';
        this.authService.twitterLogin().subscribe((loginUrl) => {
            window.location.href = loginUrl;
        });
    }

    registerViaMail(): void {
        this.authModalState.openModal(LoginPopupState.REGISTER_EMAIL, {invitationCode: this.invitationCode});
    }

    close(): void {
        this.authModalState.closeModal();
    }

    ngOnDestroy(): void {
        this.gmAuthSubs?.unsubscribe();
        this.invCodeSubs?.unsubscribe();
    }

}

export interface SocialSignupRequest {
    authToken: string;
    idToken: string;
    loginType: string;
    invitationCode: string;
}
