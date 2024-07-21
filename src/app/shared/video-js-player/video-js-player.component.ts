import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {VideoModel, VideoType2} from '../../_core/model/video.model';
import {RouterService} from '../../_core/services/router.service';

@Component({
    selector: 'app-video-js-player',
    templateUrl: './video-js-player.component.html',
    styleUrls: ['./video-js-player.component.scss']
})
export class VideoJsPlayerComponent implements OnChanges {

    @Input()
    video: VideoModel;
    @Input()
    isCarousel = false;
    @Input()
    hoverCarousel = false;
    videoUrl: string;
    show = false;
    @Output()
    videoPlaying: EventEmitter<any> = new EventEmitter();
    @Output()
    videoPaused: EventEmitter<any> = new EventEmitter();

    constructor(private routerService: RouterService) { }

    ngOnChanges(changes: SimpleChanges): void {
        // timeout is need to reinitialise video with new source
        if (changes.video) {
            this.show = false;
            this.videoUrl = this.video.videoFileUrl;
            setTimeout(() => {
                this.show = true;
            }, 100);
        }
    }

    isLive(): boolean {
        return [VideoType2.LIVE_PEER_LIVE, VideoType2.PODCAST_LIVE].indexOf(this.video?.videoType) > -1;
    }

    isRecord(): boolean {
        return [VideoType2.LIVE_PEER_RECORD, VideoType2.PODCAST_RECORD].indexOf(this.video?.videoType) > -1;
    }

    isUpload(): boolean {
        return [VideoType2.UPLOADED_VIDEO].indexOf(this.video?.videoType) > -1;
    }
    goToRoom(): void {
        this.routerService.navigateToTheRoom(this.video.roomName);
    }

}
