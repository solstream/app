import {Component, Inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AccountModel} from '../../../../../../_core/model/accountModel';
import {tokenomicsConf} from '../../../../../../tokens/tokenomics';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TxService} from '../../../../../../_core/services/tx.service';
import {StreamerContextState} from '../../../../../account-pages/host-account-live-page/stream-context-state.service';
import {Router} from '@angular/router';
import {ChatService} from '../../../../../../_core/services/chat.service';
import {MatDialog} from '@angular/material/dialog';
import {VideoModel} from '../../../../../../_core/model/video.model';

@Component({
    selector: 'app-video-title',
    templateUrl: './video-title.component.html',
    styleUrls: ['./video-title.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VideoTitleComponent implements OnInit {
    bnbAmount: number;
    currentBnbPrice: number;
    startStreamingCode = '000000';
    wrongStreamingCode: boolean;

    @Input()
    room: AccountModel;
    @Input()
    showTitle = true;
    @Input()
    video: VideoModel;
    @Input()
    isLive = false;

    streamingActionsEnabled = false;
    tokenomics = tokenomicsConf;

    constructor(public mob: DeviceDetectorService,
                private txService: TxService,
                public actions: StreamerContextState,
                private router: Router,
                private mes: ChatService,
                public dialog: MatDialog) {
    }

    ngOnInit(): void {
    }

    // interactDialog(): void {
    //     const dialogRef = this.dialog.open(DialogInteractComponent, {
    //         width: '650px',
    //         data: {startStreamingCode: this.startStreamingCode, room: this.room}
    //     });
    //     this.sendingTransaction = dialogRef.componentInstance.sendingTransaction;
    //     dialogRef.afterClosed().subscribe(result => {
    //         this.sendingTransaction = dialogRef.componentInstance.sendingTransaction;
    //         console.log('The dialog was closed');
    //         this.startStreamingCode = result;
    //         if (this.startStreamingCode === '000000') {
    //             // routerLink='/host/rooms/live/{{room.id}}'
    //             this.router.navigate(['/host/rooms/live/' + this.room.id]);
    //         } else {
    //             console.log('Wrong code');
    //         }
    //     });
    //     this.txService.txInProgress.subscribe((value) => {
    //         this.sendingTransaction = value;
    //     });
    // }

    screenShare(on: boolean): void {
        this.actions.screenShare$.next(on);
    }

    stopStreaming(): void {
        this.actions.live$.next(false);
    }
    goToIpfs():void {
        window.open(
            this.video.ipfsMetaData,
            '_blank' // <- This is what makes it open in a new window.
        );
    }

}
