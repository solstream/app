import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import {DeviceDetectorService} from 'ngx-device-detector';
import {LocalStorageService} from '../../../_core/services/auth-store.service';
import {CarouselVideoModel, VideoModel, VideoTwModel, VideoType2} from '../../../_core/model/video.model';
import {ChannelsService} from '../../../_core/services/channels.service';
import {RouterService} from '../../../_core/services/router.service';
import {AccountModel} from '../../../_core/model/accountModel';

//Reference
// https://codepen.io/sparlos/pen/JxyRWr

@Component({
    selector: 'app-tw-carousel',
    templateUrl: './tw-carousel.component.html',
    styleUrls: ['./tw-carousel.component.scss']
})
export class TwCarouselComponent implements OnInit {
    currentVideoCount = 0; // refers to tertiary video on leftmost; main video with be currentVideo+2
    totalVideos = 8;
    videos: VideoTwModel[] = [];
    videoPositions = [
        'carousel__video tertiary tertiary-left',
        'carousel__video secondary secondary-left',
        'carousel__video main',
        'carousel__video secondary secondary-right',
        'carousel__video tertiary tertiary-right'
    ];
    showSpinner = false;
    videoTypesPodcast = VideoType2.PODCAST_RECORD;
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
        this.initVideos();
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
    private filterByValue(array, value): boolean {
        return array.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
    private initVideos(): void {
        // To be improved a LOT, this should be handles smartly in BE
        // Start filling the carousel
        let newCarousel = [];
        newCarousel.push( this.carouselItems[4]);
        newCarousel.push( this.carouselItems[3]);
        newCarousel.push( this.carouselItems[0]);
        newCarousel.push( this.carouselItems[1]);
        newCarousel.push( this.carouselItems[2]);
        // Adding remaing items
        // @ts-ignore
        this.carouselItems.slice(5).forEach((element: VideoTwModel, index) => {
            if (!newCarousel.some(e => e.roomId === element.roomId)) {
                newCarousel.push(element);
            }
        });
        //Remove same user from carousel
        // newCarousel = newCarousel.filter((tag, index, array) => array.findIndex(t => t.roomId === tag.roomId) === index);

        // Preparing carousel positions
        // @ts-ignore
        newCarousel.slice(0, 5 ).forEach((element: VideoTwModel, index) => {
            element.position = this.videoPositions[index];
            element.active = false;
            this.videos.push(element);
        });
        this.videos[2].active = true;
        this.carouselVideoPlaying = this.videos[0];
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
        // @ts-ignore
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
            // this.getRoomData(videoToPlay);
            this.getRoomData(this.videos[2]);
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

    private getRoomData(video: CarouselVideoModel, index = 2): void {
        this.roomService.getRoom(video.roomId).subscribe((room) => {
            this.currentVideo = null;
            this.isReady = false;
            this.carouselVideoPlaying = video;
            this.carouselVideoPlaying.bio = room?.bioText;
            this.videos[index].bioText = this.videos[index || 2].bioText || room?.bioText;
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

    changeVideo(direction, position?): void {
        if (direction === 'left') {
            this.currentVideoCount--;
            if (this.currentVideoCount < 0) {
                this.currentVideoCount = 4;
            }

        } else if (direction === 'right') {
            this.currentVideoCount++;
            if (this.currentVideoCount > 4) {
                this.currentVideoCount = 0;
            }
        } else {
            switch (position) {
                case 'carousel__video secondary secondary-right':
                    this.changeVideo('left');
                    break;
                case 'carousel__video secondary secondary-left':
                    this.changeVideo('right');
                    break;
                case 'carousel__video tertiary tertiary-right':
                    this.changeVideo('left');
                    this.changeVideo('left');
                    break;
                case 'carousel__video tertiary tertiary-left':
                    this.changeVideo('right');
                    this.changeVideo('right');
                    break;
            }
        }
        this.videos.forEach((video, i) => {
            this.videos[i].active = false;
            let newIndex = i + this.currentVideoCount;
            if (newIndex > 4) {
                newIndex %= 5;
            }
            this.videos[i].position = this.videoPositions[newIndex];
            if (this.videos[i].position === 'carousel__video main') {
                this.videos[i].active = true;
                this.carouselVideoPlaying = this.videos[i];
                this.getRoomData(this.videos[i], i);
            }
        });
    }
    goToRoom(video): void {
        this.routerService.navigateToTheRoom(video.roomName);
    }
}

export interface VideoCarouselInputModel {
    // availableStreams: VideoModel[];
    videos: VideoModel[];
}
