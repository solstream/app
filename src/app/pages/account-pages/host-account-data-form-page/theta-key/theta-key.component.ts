import {Component, OnInit} from '@angular/core';
import {ThetaService} from '../../../../_core/services/theta.service';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';

@Component({
    selector: 'app-live-peer-key',
    templateUrl: './live-peer-key.component.html',
    styleUrls: ['./live-peer-key.component.scss']
})
export class ThetaKeyComponent implements OnInit {

    streamKey: string = null;
    loaded = false;
    creating = false;
    serverKey = 'rtmp://rtmp.theta.com/live';

    constructor(private liveStreamService: ThetaService, private currentUserState: CurrentUserState) {
    }

    ngOnInit(): void {
        this.fetchSteamKey();
    }

    private fetchSteamKey(): void {
        const accountName = this.currentUserState.currentUserAccount$.getValue()?.roomName;
        if (accountName) {
            this.liveStreamService.getStreamKey(accountName).subscribe(resp => {
                this.streamKey = resp.streamKey;
                this.loaded = true;
            }, () => {
                this.streamKey = null;
                this.loaded = true;
            });
        }
    }

    createKey(): void {
        const accountName = this.currentUserState.currentUserAccount$.getValue()?.roomName;
        if (accountName) {
            this.creating = true;
            this.liveStreamService.createStream(accountName).subscribe(response => {
                this.creating = false;
                this.streamKey = response.streamKey;
            });
        }
    }

}
