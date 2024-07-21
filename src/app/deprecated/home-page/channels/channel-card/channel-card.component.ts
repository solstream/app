import {Component, Input} from '@angular/core';
import {ChannelsMode} from '../channels.component';
import {RouterService} from '../../../../_core/services/router.service';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';
import {AccountModel} from '../../../../_core/model/accountModel';

@Component({
    selector: 'app-channel-card',
    templateUrl: './channel-card.component.html',
    styleUrls: ['./channel-card.component.scss']
})
export class ChannelCardComponent {

    @Input()
    mode: ChannelsMode = 'channel-list';

    @Input()
    hostMode = false;

    @Input()
    room: AccountModel;

    constructor(private routerService: RouterService,
                private currentUserService: CurrentUserState) {
    }

    click(): void {
        if (this.mode === 'admin' && this.currentUserService.isAdmin()) {
            this.routerService.navigateMyTvAdminMode(this.room.roomName);
            return;
        }
        this.routerService.navigateToReadOnlyRoom(this.room.roomName);
    }

}
