import {Injectable} from '@angular/core';
import {SingUpRequest} from './wallet-login/sing-up.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';
import {LocalStorageService} from '../../_core/services/auth-store.service';
import {CurrentUserState} from '../../_core/services/current-user-state.service';
import {RouterService} from '../../_core/services/router.service';
import WalletConnect from '@walletconnect/browser';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { Router } from '@angular/router';
import de from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/de";

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {

    constructor(private routerService: RouterService,
                private httpClient: HttpClient,
                private router: Router,
                private authService: LocalStorageService,
                private cus: CurrentUserState) {
    }

    isInvitationCodeValid(code: string): Observable<boolean> {
        return of(true);
        // old implementation had a key that was coming from the backend
        // return this.httpClient.get<boolean>(environment.publicAzure + `/invitation-code/${code}`);
    }

    handleAfterLoginRedirects(): void {
        const userRoom = this.cus.getCurrentUserRoom();
        if (userRoom) {
            this.routerService.navigateToMyTv(userRoom.roomName);
            return;
        }
        this.routerService.navigateToNewRoom();
    }
    handleAfterLoginRedirectsNew(): void {
        window.location.reload();
    }
    walletLogout(): void {
        const bridge = 'https://bridge.walletconnect.org';
        const connector = new WalletConnect({bridge, qrcodeModal: QRCodeModal});
        if (connector.connected) {
            connector.killSession().then(() => {
                this.cus.logout();
            });
        }
    }

    handleAfterWalletLogIn(username: string, wToken: string, gToken: string): Observable<any> {
        this.authService.setPTVToke(gToken);
        this.authService.storeWToken(wToken);
        this.authService.setUserName(username);
        this.authService.setIsWallet(true);
        return this.cus.fetchCurrentUserData();
    }

    logIn(username: string, password: string, wToken: string, isMetamask = false): Observable<any> {
        this.authService.storeWToken(wToken);
        const req = {username, password} as SingUpRequest;
        return this.httpClient.post(environment.privateAzure + '/login', req, {responseType: 'text'}).pipe(
            tap(resp => this.authService.setPTVToke(resp)),
            tap(() => this.authService.setUserName(username)),
            tap(() => this.authService.setIsWallet(isMetamask)),
            mergeMap(() => this.cus.fetchCurrentUserData()));
    }

    signUp(username: string, password: string, wToken: string, isMetamask = false): Observable<any> {
        this.authService.storeWToken(wToken);
        const req = {username, password} as SingUpRequest;
        return this.httpClient.post(environment.privateAzure + '/login', req, {responseType: 'text'}).pipe(
            tap(resp => this.authService.setPTVToke(resp)),
            tap(() => this.authService.setUserName(username)),
            tap(() => this.authService.setIsWallet(isMetamask)),
            mergeMap(() => this.cus.fetchCurrentUserData()));
    }

    twitterLogin(): Observable<any> {
        return this.httpClient.get(environment.privateAzure + '/public/token', {responseType: 'text'});
    }

    // tslint:disable-next-line:variable-name
    twAccessToken(oauth_token: string, oauth_verifier: string): Observable<any> {
        return this.httpClient.get(environment.publicAzure + `/twitter-login/${oauth_verifier}/${oauth_token}`, {responseType: 'text'});
    }

    resetPassword(username: string): Observable<void> {
        return this.httpClient.post<void>(environment.publicAzure + `/reset-password`, {email: username});
    }

}
