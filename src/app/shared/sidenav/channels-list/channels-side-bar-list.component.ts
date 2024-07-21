import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {MessageComponentState} from '../../../@mvp/shared-components/chat/channel-live-actions.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ChannelContentService} from '../../../_core/services/channel-content.service';
import {RouterService} from '../../../_core/services/router.service';
import {AccountModel} from '../../../_core/model/accountModel';
import {CurrentUserState} from '../../../_core/services/current-user-state.service';
import {Router} from '@angular/router';
import {RegistrationModalState, LoginPopupState} from '../../../@mvp/login-popup/registration-modal-state.service';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-channels-side-bar-list',
    templateUrl: './channels-side-bar-list.component.html',
    styleUrls: ['./channels-side-bar-list.component.scss']
})
export class ChannelsSideBarListComponent implements OnInit, OnDestroy {

    connectedRoomName: string;
    enteringChannelSub: Subscription;
    refreshChannelListSub: Subscription;

    @Input()
    isCollapsed: boolean;

    @Input()
    showSignupBar = true;

    channels: AccountModel[] = [];

    @Output()
    closeClicked = new EventEmitter<void>();

    constructor(private routerService: RouterService,
                private cus: CurrentUserState,
                private messageCompState: MessageComponentState,
                private router: Router,
                private channelService: ChannelContentService,
                private loginPopupService: RegistrationModalState) {
    }

    ngOnInit(): void {
        // TODO double check is this needed here as sidenav dont care about chat
        this.messageCompState.leavingRoom.next(null);
        this.channelService.getSideBarChannelsList().subscribe(rooms => {
            this.channels = rooms;
        });
        this.enteringChannelSub = this.messageCompState.enterRoom().subscribe((room) => {
            this.connectedRoomName = room.roomName;
        });
        this.refreshChannelListSub = interval(60000).pipe(filter(() => !document.hidden)).subscribe(() => {
            this.channelService.getSideBarChannelsList().subscribe(refreshedRooms => {
                const newRooms = refreshedRooms.filter(r => this.channels.findIndex(x => x.id === r.id) === -1);
                this.channels.push(...newRooms);
                this.channels.forEach(room => {
                    const refreshedRoom = refreshedRooms.find(r => r.id === room.id);
                    if (refreshedRoom && refreshedRoom.isLive !== room.isLive) {
                        room.isLive = refreshedRoom.isLive;
                    }
                });
            });
            if (this.connectedRoomName) {
                const isConnectedRoomLive = this.channels.filter(room => room.isLive && room.roomName === this.connectedRoomName).length > 0;
                if (!isConnectedRoomLive) {
                    this.messageCompState.leavingRoom.next(this.connectedRoomName);
                    this.routerService.navigateToTheRoom(this.connectedRoomName);
                }
            }
        });
    }

    goToChannel(roomName: string): void {
        this.routerService.navigateToTheRoom(roomName);
    }

    // TODO nothing changes if it is true, todo fix
    isInThisChannel(roomName: string): boolean {
        const urlParts = this.routerService.getUrlParts();
        return urlParts.indexOf(roomName) > -1;
    }

    ngOnDestroy(): void {
        this.enteringChannelSub.unsubscribe();
        this.refreshChannelListSub.unsubscribe();
    }

    isLoggedIn(): boolean {
        return this.cus.isLoggedIn();
    }

    socialLogin(): void {
        this.loginPopupService.openModal(LoginPopupState.WELCOME);
    }

}
