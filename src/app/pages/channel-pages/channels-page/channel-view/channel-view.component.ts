import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TrendingContentModel} from '../../../../_core/services/trending-content.service';
import {VideoModel, VideoType2} from '../../../../_core/model/video.model';
import {ChannelViewVideoUIService} from './channel-view-video-u-i.service';
import {AccountModel} from '../../../../_core/model/accountModel';
import {AuditService} from '../../../../_core/services/audit.service';
import {LocalStorageService} from '../../../../_core/services/auth-store.service';
import {RouterService} from '../../../../_core/services/router.service';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import {StreamViewService} from '../../../../_core/services/stream-view.service';

@Component({
    selector: 'app-channel-view',
    templateUrl: './channel-view.component.html',
    styleUrls: ['./channel-view.component.scss']
})
export class ChannelViewComponent implements OnInit {

    hideChatWindow = false;
    showChat = false;
    showAudioControls;
    roomName: string;
    rooms: AccountModel[];
    isMobile = false;
    showTitle = true;
    isMuted: boolean;
    conferenceAlias;

    otherChannelVideos: VideoModel[];

    @Input()
    set otherContent(otherContent: TrendingContentModel) {
        if (otherContent) {
            // time not to block initial load
            setTimeout(() => {
                this.otherChannelVideos = otherContent.videos;
            }, 1000);
        }
    }

    @ViewChild('videoElement', {static: false}) videoElement: ElementRef;

    constructor(private device: DeviceDetectorService,
                private videoViewService: ChannelViewVideoUIService,
                private auditService: AuditService,
                private cus: CurrentUserState,
                private routerService: RouterService,
                private authStore: LocalStorageService,
                private streamViewService: StreamViewService) {
    }

    ngOnInit(): void {
        this.isMobile = this.device.isMobile();
        this.streamViewService.showAudioControls.subscribe(val => this.toggleAudioControls(val));
    }

    // videoCardClicked(video: VideoModel): void {
    //     if (video.videoType === VideoType2.PODCAST_LIVE) {
    //         this.routerService.navigateToTheRoom(video.roomName);
    //     } else {
    //         this.routerService.navigateToTheRoomAutoPlayVideo(video.roomName, video.id);
    //     }
    //     const scrollContainer = document.getElementById('channelViewScrollContainer');
    //     scrollContainer.scrollTop = 0;
    // }

    getChatUserName(): string {
        let name;
        const userValue = this.cus.currentUserAccount$.value;
        if (userValue) {
            name = this.cus.currentUserAccount$.value.roomName;
        } else {
            name = 'Guest';
        }
        // if (!Boolean(name)) {
        //     return this.authStore.getUserNameObserver();
        // }
        return name;
    }

    // hideChat(): void {
    //     this.hideChatWindow = !this.hideChatWindow;
    // }

    // onScrollAdjustVideo(): void {
    //     const scrollContainer = document.getElementById('channelViewScrollContainer');
    //     if (scrollContainer.scrollTop > 500) {
    //         this.showTitle = false;
    //         this.videoViewService.moveVideoRight();
    //     }
    //     if (scrollContainer.scrollTop <= 300) {
    //         this.showTitle = true;
    //         this.videoViewService.moveVideoToOriginalPosition();
    //     }
    // }

    toggleAudioControls(val: boolean): void {
        this.showAudioControls = val;
        this.isMuted = false;
    }

    public unmute(): void {
        VoxeetSDK.conference.mute(VoxeetSDK.session.participant, false);
        this.isMuted = VoxeetSDK.conference.isMuted();
    }
    public mute(): void {
        VoxeetSDK.conference.mute(VoxeetSDK.session.participant, true);
        this.isMuted = VoxeetSDK.conference.isMuted();
    }

    public leave(): void {
        VoxeetSDK.conference.stopAudio(VoxeetSDK.session.participant).then(() => {
            this.showAudioControls = false;
        });
    }
}
