import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoModel, VideoType2} from '../../../_core/model/video.model';
import {RouterService} from '../../../_core/services/router.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TrendingContentModel} from '../../../_core/services/trending-content.service';

@Component({
    selector: 'app-trending-content',
    templateUrl: './trending-content.component.html',
    styleUrls: ['./trending-content.component.scss']
})
export class TrendingContentComponent implements OnInit {

    content: VideoModel[];
    livePodcasts: VideoModel[];
    _data: TrendingContentModel;

    @Input()
    set data(data: TrendingContentModel) {
        this.content = data.videos;
        this._data = data;
    }

    @Output()
    videoClicked = new EventEmitter<{ video: VideoModel, videos: VideoModel[] }>();

    @Output()
    initialLoad = new EventEmitter<{ video: VideoModel, videos: VideoModel[] }>();

    constructor(public mob: DeviceDetectorService,
                private routerService: RouterService,
    ) {}

    ngOnInit(): void {
    }

    videoCardClicked($event: VideoModel): void {
        if ($event.videoType === VideoType2.PODCAST_LIVE) {
            this.routerService.navigateToTheRoom($event.roomName);
            return;
        }
        this.routerService.navigateToTheRoomAutoPlayVideo($event.roomName, $event.id);
    }

}
