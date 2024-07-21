import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AccountModel} from '../../../../../_core/model/accountModel';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDialog} from '@angular/material/dialog';
import {CurrentUserState} from '../../../../../_core/services/current-user-state.service';
import {UploadResult, UploadVideoModalComponent} from './upload-video-modal/upload-video-modal.component';
import {RouterService} from '../../../../../_core/services/router.service';
import {ChooseLiveStreamModalComponent} from './choose-live-stream-modal/choose-live-stream-modal.component';
import {LocalStorageService} from "../../../../../_core/services/auth-store.service";
import {toNumber} from "web3-utils";

export interface StreamingDialogData {
    startStreamingCode: string;
    room: AccountModel;
}

@Component({
    selector: 'app-host-room-action-header',
    templateUrl: './room-header.component.html',
    styleUrls: ['./room-header.component.scss']
})
export class RoomHeaderComponent implements OnInit {

    @Input()
    room: AccountModel;
    @Input()
    adminMode = false;
    @Output()
    videoUploaded = new EventEmitter();
    tokenBalance: number;
    tooltipMessage = '';

    constructor(public mob: DeviceDetectorService,
                private cus: CurrentUserState,
                private localStorageService: LocalStorageService,
                private routerService: RouterService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.updateTokenBalance();
    }
    updateTokenBalance() {
        const balanceStr = this.localStorageService.getSolStreamBalance();
        this.tokenBalance = balanceStr ? parseFloat(balanceStr) : 0;
        this.updateTooltipMessage();
    }

    updateTooltipMessage() {
        if (this.tokenBalance < 100) {
            this.tooltipMessage = 'You need at least 50 $STREAM to upload videos.';
        } else {
            this.tooltipMessage = ''; // No tooltip needed if the condition is met
        }
    }

    canUploadVideo(): boolean {
        return this.isPremium() && this.tokenBalance > 100;
    }

    startStreamingDialog(): void {
        // Open dialog to choose obs or solstream spaces
        this.dialog.open(ChooseLiveStreamModalComponent, {
            panelClass: 'live-stream-dialog',
            maxWidth: '100%',
            maxHeight: '100%',
            data: {
                roomId: this.room.id
            }
        }).afterClosed().subscribe((result: UploadResult) => {
            // navigate to right page
        });
    }

    canGoLive(): boolean {
        return this.room?.userName === this.cus.currentUser$.value?.username;
    }

    isPremium(): boolean {
        return this.room?.userName === this.cus.currentUser$.value?.username && this.room?.premium === true;
    }
    has50Stream(): boolean {
        const streamTokens = this.localStorageService.getSolStreamBalance();
        const tokensAsNumber = Number(streamTokens);
        return tokensAsNumber > 49;
    }
    hasUploadedAlready(): boolean {
        const uploadedVideos = this.localStorageService.getUploadedVideosNumber();
        const uploadedVideosAsNumber = Number(uploadedVideos);
        return uploadedVideosAsNumber > 20;
        // return uploadedVideosAsNumber > 0;
    }
    getUploadButtonTooltip(): string {
        if (this.hasUploadedAlready()) {
            return 'You have already uploaded 20 videos, we will extend the functionality soon.';
        } else if (!this.has50Stream()) {
            return 'You need at least 50 $STREAM to upload a video.';
        }
        return ''; // No tooltip needed if neither condition is met
    }

    uploadContentModal(): void {
        this.dialog.open(UploadVideoModalComponent, {
            width: '650px',
            data: {roomId: this.room.id}
        }).afterClosed().subscribe((result: UploadResult) => {
            if (result === 'done') {
                this.videoUploaded.emit();
            }
        });
    }

}



