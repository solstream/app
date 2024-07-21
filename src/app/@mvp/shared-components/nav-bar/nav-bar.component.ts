import { Component, Inject, Input, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../_core/services/auth-store.service';
import { Router } from '@angular/router';
import { RouterService } from '../../../_core/services/router.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { tokenomicsConf } from '../../../tokens/tokenomics';
import { CurrentUserState } from '../../../_core/services/current-user-state.service';
import { User } from '../../../pages/admin-pages/admin.component';
import { SearchUiService } from '../../../pages/search/search-ui.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AccountModel } from '../../../_core/model/accountModel';
import { RegistrationModalState, LoginPopupState } from '../../login-popup/registration-modal-state.service';
import { EarningsService } from '../../../_core/services/earnings.service';
import { AuthorizationService } from "../../login-popup/authorization.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import de from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/de";
import * as bs58 from 'bs58';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public mobileSearch = false;
  public solstreamBalance;
  public solstreamDecimalBalance;

  loggedIn = false;
  user: User;
  currentUserRoom: AccountModel;
  @Input()
  disable = false;
  streamTokens = '0';

  search = new FormControl('');

  tokenomics = tokenomicsConf;

  constructor(private authService: LocalStorageService,
              public mob: DeviceDetectorService,
              @Inject(DOCUMENT) private document: any,
              private routerService: RouterService,
              private loginService: AuthorizationService,
              private currentUserService: CurrentUserState,
              private cus: CurrentUserState,
              private ss: SearchUiService,
              private httpClient: HttpClient,
              private router: Router,
              private localStorageService: LocalStorageService,
              private loginPopupService: RegistrationModalState,
              private earningService: EarningsService) {
  }

  ngOnInit(): void {
    // Assuming this.localStorageService.getSolStreamBalance() returns a string like "50.00"
    const balanceString = this.localStorageService.getSolStreamBalance();
// Split the balance string into two parts: integer and decimals
    const [integerPart, decimalPart] = balanceString.split('.');

    this.solstreamBalance = integerPart; // This should be "50"
    this.solstreamDecimalBalance = decimalPart; // This should be "00"


    if (this.currentUserService.isLoggedIn()) {
      this.getsolstreamBalance();
    }
    if (this.router.routerState.snapshot.toString().indexOf('search') === -1) {
      this.ss.search$.next('');
    }
    this.search.setValue(this.ss.search$.value);
    this.loggedIn = this.authService.getSecurityUserName() !== null;
    this.currentUserService.currentUser$.subscribe(user => {
      this.user = user;
    });
    this.currentUserService.currentUserAccount$.subscribe(room => {
      this.currentUserRoom = room;
    });
    this.search.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
      this.setSearch();
    });
  }

  isLoggedIn(): boolean {
    return this.authService.getSecurityUserName() !== null;
  }

  setSearch(): void {
    this.ss.search(this.search.value);
    if (this.router.routerState.snapshot.toString().indexOf('search') === -1) {
      this.router.navigate(['search']);
    }
  }

  toggleMobileSearch(): void {
    this.mobileSearch = !this.mobileSearch;
  }

  getBusdBalance(): string {
    return this.authService.getTokensBalance();
  }

  private getsolstreamBalance(): void {
    // this.earningService.getTotalEarningsV3().subscribe(data => {
    //   const earnings = data.earnings;
    //   // this.solstreamBalance = earnings > 0 ? earnings.toFixed(0) : '0';
    //   // this.solstreamDecimalBalance = earnings > 0 ? earnings.toFixed(2).toString().split('.')[1] : '00';
    //   this.solstreamBalance = '0';
    //   this.solstreamDecimalBalance = '00';
    // });
  }

  showLogin(): boolean {
    const isLoginPage = this.router.url.indexOf('login') > 0;
    if (isLoginPage) {
      return false;
    }
    return !this.loggedIn;
  }

  goToConsole(): void {
    const roomName = this.currentUserRoom?.roomName;
    if (this.currentUserService.isAdmin() && this.user.username.toLowerCase() === 'admin') {
      this.routerService.navigateToAdmin();
    } else {
      this.routerService.navigateToMyTv(roomName);
    }
  }

  createAccount(): void {
    this.loginPopupService.openModal(LoginPopupState.WELCOME);
  }

  login(): void {
    this.loginPopupService.openModal(LoginPopupState.LOGIN);
  }
  async loginWithWallet(): Promise<void> {
    const provider = this.getProvider();
    await provider.connect();
    const walletAddress = provider.publicKey.toString();
    const message = 'Sign in to authenticate';
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await provider.signMessage(encodedMessage, 'utf8');
    const signatureBase58 = bs58.encode(new Uint8Array(signedMessage.signature));
    const payload = {
      walletAddress,
      signature: signatureBase58,
      message
    };
    console.log('login');
    console.log(payload);
    try {
      this.httpClient.post(environment.privateAzure + '/login/ph', payload)
        .subscribe({
          next: (data: any) => {
            this.saveUserLoginDataToLocalStorage(data);
            this.cus.fetchCurrentUserData().subscribe();
          },
          error: () => {
            alert('Login failed, please check if using correct wallet');
          }
        });

    } catch (error) {
      console.error('Login with wallet failed:', error);
    }
  }

  getProvider(): any {
    if ("solana" in window) {
      // @ts-ignore
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    window.alert('Phantom wallet not found. Please install it.');
    return null;
  }

  async registerWithWallet(): Promise<void> {
    const provider = this.getProvider();
    await provider.connect();
    const walletAddress = provider.publicKey.toString();
    const message = `Sign in to authenticate`;
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await provider.signMessage(encodedMessage, 'utf8');
    const signatureBase58 = bs58.encode(new Uint8Array(signedMessage.signature));

    const payload = {
      walletAddress,
      signature: signatureBase58,
      signatureOld: Array.from(signedMessage.signature),
      message
    };

    try {
      this.httpClient.post(environment.privateAzure + '/sign-up/ph', payload)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.saveUserLoginDataToLocalStorage(data);
            this.cus.fetchCurrentUserData().subscribe();
          },
          error: (error) => {
            console.error('Registration with wallet failed:', error);
            if (error.error.msg === 'User already exists with this wallet address') {
              alert('User already exists with this wallet address. Please log in.');
            } else {
              alert('An error occurred during registration. Please try again.');
            }
          }
        });
    } catch (error) {
      console.error('Registration with wallet failed:', error);
      throw error;
    }
  }

  private saveUserLoginDataToLocalStorage(data: any): void {
    this.authService.storeWToken(data.wToken);
    this.authService.setPTVToke(data.gToken);
    this.authService.setUserName(data.userName);
    this.authService.setIsWallet(true);
    this.authService.setUserId(data.userId);
  }
}
