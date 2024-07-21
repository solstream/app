import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import {DeviceDetectorService} from 'ngx-device-detector';
import {LocalStorageService} from '../../../_core/services/auth-store.service';
import {CarouselVideoModel, VideoModel, VideoType2} from '../../../_core/model/video.model';
import {ChannelsService} from '../../../_core/services/channels.service';
import {RouterService} from '../../../_core/services/router.service';
import {AccountModel} from '../../../_core/model/accountModel';

@Component({
    selector: 'app-video-carousel',
    templateUrl: './video-carousel.component.html',
    styleUrls: ['./video-carousel.component.scss']
})
export class VideoCarouselComponent implements OnInit {

    showSpinner = false;
    unhideVideo = false;
    isThetaStream = false;
    isLiveStream = false;
    isLiveStreamReady = false;
    liveStream: AccountModel = null;
    iconLeft = faChevronLeft;
    iconRight = faChevronRight;
    carouselItems: VideoModel[];
    carouselVideoPlaying: CarouselVideoModel;
    isReady = false;
    currentVideo: VideoModel;
    currentVideoRoom: AccountModel = null;
    isInTheRoom = false;
    userName: string;
    index = 0;
    isMob = false;
    videoTypeObsLive = VideoType2.LIVE_PEER_LIVE;

    input: VideoCarouselInputModel = null;

    @Input()
    set carouselInput(input: VideoCarouselInputModel) {
        this.input = input;
        this.carouselItems = [...input.videos];
    }

    @ViewChild('myDOMElement', {static: false}) videoCard: ElementRef;
    @ViewChild('myDOMElement1', {static: false}) card: ElementRef;

    // @ViewChild('cVideoList', {static: false}) videos: ElementRef;

    constructor(public mob: DeviceDetectorService,
                private roomService: ChannelsService,
                private routerService: RouterService,
                private authStore: LocalStorageService,
                private renderer: Renderer2) {
        this.isReady = true;
        this.isMob = this.mob.isMobile();
    }

    ngOnInit(): void {
        this.resetRoom();
    }

    private adoptSize(): void {
        setTimeout(() => {
            if (this.videoCard) {
                // const height = this.videoCard.nativeElement.offsetHeight;
                // const videoWidth = height * 1.78;
                // this.renderer.setStyle(this.videoCard.nativeElement, 'max-width', `${videoWidth}px`);
            }
        }, 100);
    }

    show = true;
    nextClick(): void {
        this.show = false;
        if (this.hasMoreThanOne()) {
            this.index = this.index + 1;
            if (this.index === this.carouselItems.length) {
                this.index = 0;
            }
            this.resetRoom();
        }
    }

    failedJoin(): void {
        this.carouselItems.splice(this.index, 1);
        this.nextClick();
    }

    previousClick(): void {
        if (this.hasMoreThanOne()) {
            this.index = this.index - 1;
            if (this.index < 0) {
                this.index = this.carouselItems.length - 1;
            }
            this.resetRoom();
        }
    }

    playStart(event = null): void {
        console.log('play exec');
        setTimeout(() => {
            this.showSpinner = false;
        }, 1000);

        setTimeout(() => {
            this.unhideVideo = true;
        });
    }

    showVideo(): boolean {
        return !this.isLiveStream && !this.isThetaStream && this.currentVideo !== null;
    }

    showTheta(): boolean {
        return !this.isLiveStream && this.isThetaStream && this.currentVideo !== null;
    }

    showDolbyConference(): boolean {
        return this.isLiveStream && this.isLiveStreamReady && this.currentVideoRoom !== null;
    }

    private resetRoom(): void {
        this.showSpinner = true;
        this.unhideVideo = false;
        this.currentVideo = null;
        this.isLiveStreamReady = false;
        const itemToPlay = this.carouselItems[this.index] as VideoModel;
        this.isThetaStream = itemToPlay.videoType === VideoType2.LIVE_PEER_LIVE;
        if (itemToPlay.videoType !== VideoType2.PODCAST_LIVE) {
            this.isLiveStream = false;
            const videoToPlay = itemToPlay as VideoModel;
            this.currentVideo = null;
            this.carouselVideoPlaying = videoToPlay;
            this.getRoomData(videoToPlay);
            return;
        }
        this.isLiveStream = true;

        setTimeout(() => {
            this.isLiveStreamReady = true;
        }, 500);
        this.liveStream = itemToPlay as AccountModel;
        this.getRoomData(itemToPlay);
    }

    private playVideo(): void {
        if (this.isThetaStream) {
            this.playStart(null);
            return;
        }
        const video = document.getElementById('video') as HTMLVideoElement;
        const startPlayPromise = video?.play();
        if (startPlayPromise !== undefined) {
            startPlayPromise.then(() => {
                video.controls = true;
                console.log('paying');
                this.playStart(null);
            }).catch(error => {
                video.controls = true;
                video.muted = true;
                const startPlayPromise1 = video.play();
                startPlayPromise1.then(() => {
                    console.log('paying attempt 2');
                    this.playStart(null);
                }).catch((error1) => {
                    console.log('error second attempt for play', error1);
                    video.controls = true;
                    video.muted = false;
                    this.playStart(null);
                });
            });
        }
    }

    private hasMoreThanOne(): boolean {
        return this.carouselItems?.length > 0;
    }

    navigateToChannel(): void {
        this.routerService.navigateToTheRoom(this.currentVideoRoom.roomName);
    }

    private getRoomData(video: CarouselVideoModel): void {
        this.roomService.getRoom(video.roomId).subscribe((room) => {
            this.currentVideo = null;
            this.isReady = false;
            this.carouselVideoPlaying = video;
            this.carouselVideoPlaying.bio = room?.bioText;
            this.currentVideo = this.carouselVideoPlaying;
            this.currentVideo.roomAvatarUrl = room.avatarAzureUrl;
            this.currentVideoRoom = room;
            this.index = this.carouselItems.findIndex(v => v.id === video.id);
            this.isReady = true;
            this.adoptSize();
            if (!this.isLiveStream) {
                setTimeout(() => {
                    this.playVideo();
                }, 10);
            }

        });
    }
}

export interface VideoCarouselInputModel {
    // availableStreams: VideoModel[];
    videos: VideoModel[];
}
