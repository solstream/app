import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoModel} from '../../../../../../_core/model/video.model';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
    selector: 'app-channel-view-live-recordings-list',
    templateUrl: './channel-view-live-recordings-list.component.html'
})
export class ChannelViewLiveRecordingsListComponent {

    @Output()
    videoClicked = new EventEmitter<{ video: VideoModel, videos: VideoModel[] }>();

    @Input()
    liveRecordings: VideoModel[];

    showAllPodcasts = false;

    constructor(public mob: DeviceDetectorService) {
    }

    videoCardClicked($event: VideoModel): void {
        this.videoClicked.emit({video: $event, videos: this.liveRecordings});
    }

}
