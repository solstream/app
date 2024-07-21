import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HostStreamComponent} from './host-stream/host-stream.component';
import {StreamerContextState} from './stream-context-state.service';
import {RouterService} from '../../../_core/services/router.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {AccountModel} from '../../../_core/model/accountModel';
import {CurrentUserState} from '../../../_core/services/current-user-state.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-room-live',
    templateUrl: './account-live.component.html',
    styleUrls: ['./account-live.component.scss']
})
export class AccountLiveComponent implements OnInit, OnDestroy {

    room: AccountModel;
    subscription: Subscription;
    userName = '';
    conferenceId;
    inviteEnabled: boolean;
    @ViewChild(HostStreamComponent, {static: true})
    hostStreamComponent: HostStreamComponent;

    constructor(public mob: DeviceDetectorService,
                private routerService: RouterService,
                public scx: StreamerContextState,
                private cus: CurrentUserState) {
    }

    ngOnInit(): void {
        this.userName = this.cus.currentUser$.value.username;
        this.subscription = this.cus.currentUserAccount$.subscribe((room) => {
            if (room === null) {
                this.routerService.navigateToNewRoom();
            }
            this.room = room;
            this.userName = room.roomName;
            this.scx.hostRoom$.next(room);
        });
    }

    joinConference({ conferenceId, inviteEnabled }): void {
        this.inviteEnabled = inviteEnabled;
        this.conferenceId = conferenceId;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
