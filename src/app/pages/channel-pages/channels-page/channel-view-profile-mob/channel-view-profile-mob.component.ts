import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoModel, VideoState, VideoType2} from '../../../../_core/model/video.model';
import {AccountModel} from '../../../../_core/model/accountModel';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {ChannelsService} from '../../../../_core/services/channels.service';
import {CommentsComponentState} from '../_shared/video-comments/comments-component-state.service';
import {VideoService} from '../../../../_core/services/videos.service';
import {RouterService} from '../../../../_core/services/router.service';
import {MobLayoutService} from './mob-layout.service';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';
import {FeatureToggleService} from '../../../../_core/services/feature-toggle.service';

@Component({
    selector: 'app-channel-view-profile-mob',
    templateUrl: './channel-view-profile-mob.component.html',
    styleUrls: ['./channel-view-profile-mob.component.scss']
})
export class ChannelViewProfileMobComponent implements OnInit {
    showSpinner = true;

    videoFileUrl: string;
    videoInPlayer: VideoModel;
    dolbyStream: VideoModel;
    liveRecordings: VideoModel[] = [];
    uploadedVideos: VideoModel[] = [];
    pops: VideoModel[] = [];
    allVideos: VideoModel[] = [];
    isDolbyLive = false;

    channel: AccountModel;
    channelName: string;
    channelContentLoaded = false;

    showMessages = false;
    showAll = false;
    showOtherContent = true;

    videoState: VideoState = VideoState.DEFAULT;
    videoTypeObsLive = VideoType2.LIVE_PEER_LIVE;

    @Input()
    showTitle = false;
    @Output()
    showChat = new EventEmitter<boolean>(false);
    @Output()
    hostRoomChange = new EventEmitter();
    @Input()
    videosAndPodcasts: VideoModel[] = [];

    constructor(private activatedRoute: ActivatedRoute,
                private layoutService: MobLayoutService,
                private roomService: ChannelsService,
                private componentComponentState: CommentsComponentState,
                private routerService: RouterService,
                private videosService: VideoService,
                private cus: CurrentUserState,
                private featureService: FeatureToggleService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParamMap.subscribe(() => {
            if (this.isTheSameRoom()) {
                this.resetVideoPlayer();
                this.initializeVideoPlayer();
            }
        });
        this.activatedRoute.paramMap.subscribe(() => {
            this.resetVideoPlayer();
            this.channelName = this.activatedRoute.snapshot.paramMap.get('roomName');
            this.roomService.getRoomByName(this.channelName).subscribe((channel) => {
                this.channel = channel;
                setTimeout(() => {
                    // TODO consider solving with css not dynamically
                    this.layoutService.adjustOtherContent();
                }, 50);
            });
            this.videosService.getAllChannelVideos(this.channelName).subscribe(videos => {
                this.allVideos = videos;
                this.uploadedVideos = videos.filter(v => v.videoType === VideoType2.UPLOADED_VIDEO);
                this.liveRecordings = videos.filter(v =>
                    v.videoType === VideoType2.PODCAST_RECORD ||
                    v.videoType === VideoType2.LIVE_PEER_RECORD);
                this.pops = videos.filter(v => v.videoType === VideoType2.POP);
                this.initializeVideoPlayer();
                setTimeout(() => {
                    // TODO consider solving with css not dynamically
                    this.layoutService.adjustOtherContent();
                }, 50);
            });
        });

        // Reset videoState to DEFAULT whenever user navigates away from this component
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.videoState = VideoState.DEFAULT;
            }
        });
    }

    // onPlay($event): void {
    //     this.videoState = VideoState.PLAYING;
    // }
    //
    // onPause($event): void {
    //     this.videoState = VideoState.PAUSED;
    // }

    updateVideoState(videoState: VideoState): void {
        this.videoState = videoState;
    }

    private resetVideoPlayer(): void {
        this.isDolbyLive = false;
        this.channelContentLoaded = false;
        this.showSpinner = true;
        this.videoFileUrl = null;
    }

    liveEnded(): void {
        this.allVideos = this.allVideos.filter(x => x.videoType !== VideoType2.PODCAST_LIVE);
        this.isDolbyLive = false;
        this.playVideo(this.allVideos);
        this.showChat.emit(false);
    }

    private initializeVideoPlayer(): void {
        const live = this.allVideos.filter(v => v.videoType === VideoType2.PODCAST_LIVE);
        if (live?.length > 0) {
            this.setUpForDolbyLive(live);
            return;
        }
        this.isDolbyLive = false;
        if (this.allVideos?.length > 0) {
            this.playVideo(this.allVideos);
            this.showChat.emit(false);
        }
        setTimeout(() => {
            this.showSpinner = false;
        }, 200);
        this.layoutService.scrollTop();
    }

    private setUpForDolbyLive(live: VideoModel[]): void {
        this.dolbyStream = live[0];
        this.showChat.emit(true);
        this.channelContentLoaded = true;
        setTimeout(() => {
            this.isDolbyLive = true;
            this.showSpinner = false;
        }, 200);
    }

    private playVideo(videos: VideoModel[]): void {
        const videoId = this.activatedRoute.snapshot.queryParamMap.get('videoId');
        if (!videoId) {
            this.routerService.navigateToTheRoomAutoPlayVideo(this.channelName, videos[0]?.id);
        }
        this.videoInPlayer = videos.find(v => v.id === videoId);
        if (!this.videoInPlayer) {
            this.videoInPlayer = videos[0];
        }
        this.videoFileUrl = this.videoInPlayer?.videoFileUrl;
        this.refreshCommentComponentState(this.videoInPlayer);
    }

    videoCardClicked(video: VideoModel): void {
        this.routerService.navigateToTheRoomAutoPlayVideo(this.channelName, video.id);
    }

    // navigateToRoom(video: VideoModel): void {
    //     this.routerService.navigateToTheRoomAutoPlayVideo(video.roomName, video.id);
    //     this.layoutService.scrollTop();
    // }

    changeShowMessages(show: boolean): void {
        this.showMessages = show;
        this.layoutService.adjustLayoutAfterCommentsVisibilityChange(show);
    }

    private refreshCommentComponentState(video: VideoModel): void {
        this.componentComponentState.getVideoComments(video).subscribe();
        this.channelContentLoaded = true;
    }

    private isTheSameRoom(): boolean {
        return this.channelName === this.activatedRoute.snapshot.paramMap.get('roomName');
    }

    showEarningsProgress(): boolean {
        return this.cus.isLoggedIn() && Boolean(this.videoInPlayer);
    }

}
