import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import videojs from 'video.js';

// if needed workaround, dynamically updated the src of the player doesn't work as reported here https://github.com/videojs/video.js/issues/4467
@Component({
    selector: 'app-video-js-item',
    templateUrl: './video-js-item.component.html',
    styleUrls: ['../video-js-player.component.scss', './video-js-item.component.scss'],
})
export class VideoJsItemComponent implements OnInit, OnDestroy {

    // TODO video js could take full size off container.
    @Input()
    isCarousel = false;
    @Input()
    videoUrl: string;
    @Output()
    videoPlaying: EventEmitter<any> = new EventEmitter();
    @Output()
    videoPaused: EventEmitter<any> = new EventEmitter();
    private player: videojs.Player;

    ngOnInit(): void {

        // was not being initialized properly without timeout potential improvement https://videojs.com/guides/angular/

        setTimeout(() => {
            this.player = videojs('gtvVideoPlayer', {
                preload: 'metadata',
                controls: true,
                playsinline: true,
                fluid: false,
                sources: [{
                    src: this.videoUrl,
                    type: !(this.videoUrl.indexOf('m3u8') > 0) ? 'video/mp4' : 'application/x-mpegURL'
                }]
            });
        }, 20);


        setTimeout(() => {
            this.player.play().then(() => {
                console.log('autoplay available');
            }, () => {
                console.log('autoplay not available');
                this.player.muted(true);
                this.player.play().then(() => console.log('playing muted'));
            });
        }, 100);

    }

    onPlay(e): void {
        this.videoPlaying.next(e);
    }

    onPause(e): void {
        this.videoPaused.next(e);
    }

    ngOnDestroy(): void {
        this.player?.dispose();
    }
}
