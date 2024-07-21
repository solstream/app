import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {VideoModel, VideoState, VideoType2} from '../../../../../_core/model/video.model';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {VideoService} from '../../../../../_core/services/videos.service';
import {CommentsComponentState} from '../../_shared/video-comments/comments-component-state.service';
import {AccountModel} from '../../../../../_core/model/accountModel';
import {ChannelsService} from '../../../../../_core/services/channels.service';
import {RouterService} from '../../../../../_core/services/router.service';
import {AuditService} from '../../../../../_core/services/audit.service';

@Component({
    selector: 'app-channel-view-profile',
    templateUrl: './channel-view-profile.component.html',
    styleUrls: ['./channel-view-profile.component.scss']
})
export class ChannelViewProfileComponent implements OnInit {
    showSpinner = true;

    videoFileUrl: string;
    videoInPlayer: VideoModel;
    liveStream: VideoModel;
    videoTypeObsLive = VideoType2.LIVE_PEER_LIVE;
    liveRecordings: VideoModel[] = [];
    uploadedVideos: VideoModel[] = [];
    pops: VideoModel[] = [];
    allVideos: VideoModel[] = [];
    isLive = false;

    channel: AccountModel;
    channelName: string;
    channelContentLoaded = false;

    @Input()
    showTitle = false;
    @Output()
    showChat = new EventEmitter<boolean>(false);

    @Output()
    hostRoomChange = new EventEmitter();

    @Output()
    conferenceCreated = new EventEmitter();

    videoState: VideoState = VideoState.DEFAULT;

    // @ViewChild('container', {static: false})
    // container: ElementRef;

    @ViewChild('scrollToTop') private myScrollContainer: ElementRef;

    videoIndex = 0;

    constructor(private activatedRoute: ActivatedRoute,
                private roomService: ChannelsService,
                private routerService: RouterService,
                private commentsComponentState: CommentsComponentState,
                private videosService: VideoService,
                private auditService: AuditService,
                private router: Router) {
    }

    onPlay($event): void {
        this.videoState = VideoState.PLAYING;
    }

    onPause($event): void {
        this.videoState = VideoState.PAUSED;
    }

    onConferenceCreated($event): void {
        this.conferenceCreated.emit($event);
    }

    updateVideoState(videoState: VideoState): void {
        this.videoState = videoState;
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
            });
            this.videosService.getAllChannelVideos(this.channelName).subscribe(videos => {
                this.allVideos = videos;
                this.liveRecordings = videos.filter(v =>
                    v.videoType === VideoType2.PODCAST_RECORD ||
                    v.videoType === VideoType2.LIVE_PEER_RECORD);
                this.uploadedVideos = videos.filter(v => v.videoType === VideoType2.UPLOADED_VIDEO);
                this.pops = videos.filter(v => v.videoType === VideoType2.POP);
                this.initializeVideoPlayer();
            });
        });

        // Reset videoState to DEFAULT whenever user navigates away from this component
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.videoState = VideoState.DEFAULT;
            }
        });
    }

    private resetVideoPlayer(): void {
        this.isLive = false;
        this.channelContentLoaded = false;
        this.showSpinner = true;
        this.videoFileUrl = null;
    }

    liveEnded(): void {
        this.allVideos = this.allVideos.filter(x => x.videoType !== VideoType2.PODCAST_LIVE);
        this.isLive = false;
        this.playVideo(this.allVideos);
        this.showChat.emit(false);
    }

    private initializeVideoPlayer(): void {
        const live = this.allVideos.filter(v => v.videoType === VideoType2.PODCAST_LIVE);
        if (live?.length > 0) {
            this.setUpPageForLive(live);
            return;
        }
        this.isLive = false;
        if (this.allVideos?.length > 0) {
            this.playVideo(this.allVideos);
            this.showChat.emit(false);
        }
        setTimeout(() => {
            this.showSpinner = false;
        }, 200);
        document.getElementById('channelViewScrollContainer').scrollTop = 0;
    }

    private setUpPageForLive(live: VideoModel[]): void {
        this.liveStream = live[0];
        this.showChat.emit(true);
        this.channelContentLoaded = true;
        setTimeout(() => {
            this.isLive = true;
            this.showSpinner = false;
        }, 200);
    }

    private playVideo(videos: VideoModel[]): void {
        const videoId = this.activatedRoute.snapshot.queryParamMap.get('videoId');
        if (!videoId) {
            return this.routerService.navigateToTheRoomAutoPlayVideo(this.channelName, videos[0]?.id);
        }
        this.videoInPlayer = videos.find(v => v.id === videoId);
        if (!this.videoInPlayer) {
            this.videoInPlayer = videos[0];
        }
        this.auditService.videoViewed(this.videoInPlayer.id).subscribe();
        this.videoFileUrl = this.videoInPlayer?.videoFileUrl;
        this.refreshCommentComponentState(this.videoInPlayer);
    }

    private isTheSameRoom(): boolean {
        return this.channelName === this.activatedRoute.snapshot.paramMap.get('roomName');
    }

    videoCardClicked(video: VideoModel): void {
        // window.location.href = `/home/room/${this.channelName}/?videoId=${video.id}`;
        // this.routerService.navigateToTheRoomAutoPlayVideo(this.channelName, video.id);
    }

    private refreshCommentComponentState(video: VideoModel): void {
        this.commentsComponentState.getVideoComments(video).subscribe();
        this.channelContentLoaded = true;
    }

    showEarningProgress(): boolean {
        return Boolean(this.videoInPlayer);
    }

}
