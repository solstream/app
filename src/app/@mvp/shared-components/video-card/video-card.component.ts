import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoModel, VideoType2} from '../../../_core/model/video.model';
import {DomSanitizer} from '@angular/platform-browser';
import {DeviceDetectorService} from 'ngx-device-detector';
import {AuditService} from '../../../_core/services/audit.service';
import {NFTPopupService, NFTPopupState} from './nft-popup/nft-popup.service';
import {HttpClient} from '@angular/common/http';
import {RouterService} from '../../../_core/services/router.service';

@Component({
    selector: 'app-video-card',
    templateUrl: './video-card.component.html',
    styleUrls: ['./video-card.component.scss']
})
export class VideoCardComponent implements OnInit {

    hidden = true;
    videoTypesPodcast = VideoType2.PODCAST_RECORD;
    videoTypeVideo = VideoType2.UPLOADED_VIDEO;
    videoTypeLive = VideoType2.PODCAST_LIVE;
    videoTypeObsLive = VideoType2.LIVE_PEER_LIVE;
    nftModalOpened = false;
    videoRouting = '';
    videoType2 = VideoType2;

    @Input()
    isPop = false;

    @Input()
    compact = false;
    @Input()
    video: VideoModel;
    @Input()
    editable = false;
    @Input()
    showRoomData = false;
    @Input()
    showType = true;
    @Input()
    homePage = false;

    @Output()
    deleteVideo = new EventEmitter();
    @Output()
    videoCardClicked = new EventEmitter<VideoModel>();

    constructor(private sanitizer: DomSanitizer,
                private mob: DeviceDetectorService,
                private auditService: AuditService,
                private httpClient: HttpClient,
                private routerService: RouterService,
                private NftPopupService: NFTPopupService) {
    }

    ngOnInit(): void {
        this.videoRouting = `/home/room/${this.video.roomName}/?videoId=${this.video.id}`;

        // if (this.isPop) {
        //     this.videoRouting = `/pops/${this.video.id}`;
        // } else {
        //     this.videoRouting = `/home/room/${this.video.roomName}/?videoId=${this.video.id}`;
        // }
    }

    delete(): void {
        this.deleteVideo.emit(this.video);
    }

    goToVideo(): void {
        this.routerService.navigateToTheRoomAutoPlayVideo(this.video.roomName, this.video.id);
    }

    getBackgroundImageUrl(): string {
        return `url(${this.video.snapShotUrl})`;
    }

    getUrl(): string {
        return this.video.videoFileUrl;
    }

    isVideoAndHasUrl(): boolean {
        return !Boolean(this.video.videoFileUrl) && !Boolean(this.video.videoType === this.videoTypeLive);
    }

    getLink(): string {
        return `/home/${this.video.roomName}/room`;
    }

    cardClicked(): void {
        this.videoCardClicked.emit(this.video);
    }

    mintNFT(): void {
        if (this.nftModalOpened === false) {
            this.nftModalOpened = true;
            this.NftPopupService.openModal(NFTPopupState.OPEN, this.video);
        }
    }

}

export enum VideoCardVideoMode {
    InTheCard = 'in-card',
    EventOnly = 'event-only'
}
