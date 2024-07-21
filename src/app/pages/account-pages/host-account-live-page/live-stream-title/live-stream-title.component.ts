import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AccountModel} from '../../../../_core/model/accountModel';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {StreamerContextState} from '../stream-context-state.service';
import {filter, take} from 'rxjs/operators';

@Component({
    selector: 'app-live-stream-title',
    templateUrl: './live-stream-title.component.html',
    styleUrls: ['./live-stream-title.component.scss']
})
export class LiveStreamTitleComponent implements OnInit {
    @Input()
    room: AccountModel;
    @Output()
    stopStream = new EventEmitter();
    streamingActionsEnabled = false;

    constructor(public mob: DeviceDetectorService,
                private router: Router,
                public scx: StreamerContextState,
                public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.scx.live$.pipe(filter(x => x), take(1)).subscribe(() => {
            this.initializeStreamActionsWithDelay();
        });
    }

    counterLimitReached(): void {
        this.scx.live$.next(false);
    }

    private initializeStreamActionsWithDelay(): void {
        // delay is needed for dolby.io stability on actions.
        // 1.scx.live is true, when user clicks 'go live'
        // 2.initialisation starts, need to wait for all api calls to finish
        // TODO improve with additional state param, that would be set when initialisation is complete
        setTimeout(() => {
            this.streamingActionsEnabled = true;
        }, 10000);
    }

    startStreamingDialog(): void {
        this.router.navigate(['/host/rooms/live/' + this.room.id]);
    }

    screenShare(on: boolean): void {
        this.scx.screenShare$.next(on);
    }

    video(on: boolean): void {
        this.scx.video$.next(on);
    }

    stopStreaming(): void {
        this.scx.live$.next(false);
        this.scx.liveTerminationInProgress$.next(true);
    }


}
