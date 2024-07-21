import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from '../../../../_core/services/auth-store.service';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {RouterService} from '../../../../_core/services/router.service';
import {User} from '../../../../pages/admin-pages/admin.component';
import WalletConnect from '@walletconnect/browser';
import QRCodeModal from '@walletconnect/qrcode-modal';
import {AccountModel} from '../../../../_core/model/accountModel';
import {SocialAuthService} from 'angularx-social-login';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings-menu.component.html',
    styleUrls: ['./user-settings-menu.component.scss']
})
export class UserSettingsMenuComponent implements OnInit {

    avatarSrc: string;
    roomId: string;
    currentUserRoom: AccountModel;
    user: User;

    constructor(private authStore: LocalStorageService,
                private currentUserService: CurrentUserState,
                private cus: CurrentUserState,
                private authService: SocialAuthService,
                private routerService: RouterService,
                public mob: DeviceDetectorService) {
    }

    ngOnInit(): void {
        this.currentUserService.currentUser$.subscribe(user => {
            this.user = user;
        });
        this.currentUserService.currentUserAccount$.subscribe(room => {
            debugger;
            this.currentUserRoom = room;
            this.roomId = room?.id;
            this.avatarSrc = room?.avatarAzureUrl || '/assets/icons/login-btn.png';
        });
    }

    logout(): void {
        const bridge = 'https://bridge.walletconnect.org';
        const connector = new WalletConnect({bridge, qrcodeModal: QRCodeModal});
        if (connector.connected) {
            connector.killSession().then(() => {
                this.currentUserService.logout();
                this.avatarSrc = '/assets/icons/login-btn.png';
            });
        } else {
            this.authService.signOut().then(() => console.log('logged out'));
            this.currentUserService.logout();
            this.avatarSrc = '/assets/icons/login-btn.png';
        }
    }

    goToConsole(): void {
        const roomName = this.currentUserRoom?.roomName;
        this.routerService.navigateToMyTv(roomName);
    }

    navigateToEditProfile(): void {
        const roomId = this.currentUserRoom?.id;
        this.routerService.navigateToEditProfile(roomId);
    }

    navigateToEarnings(): void {
        this.routerService.navigateToEarnings();
    }

    navigateToAdmin(): void {
        this.routerService.navigateToAdmin();
    }
    isPremium(): boolean {
        let premium = false;
        if (this.currentUserRoom && this.currentUserRoom.userName) {
            premium = this.currentUserRoom?.userName === this.cus.currentUser$.value?.username && this.currentUserRoom?.premium === true;
        }
        return premium;
    }
}
