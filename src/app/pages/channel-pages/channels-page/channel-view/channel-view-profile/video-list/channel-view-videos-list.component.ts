import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoModel} from '../../../../../../_core/model/video.model';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-channel-view-video-list',
  templateUrl: './channel-view-videos-list.component.html'
})
export class ChannelViewVideosListComponent {

  showAll = false;

  @Output()
  videoClicked = new EventEmitter<{ video: VideoModel, videos: VideoModel[] }>();

  @Input()
  uploadedVideos: VideoModel[];

  constructor(public mob: DeviceDetectorService) {
  }

  videoCardClicked($event: VideoModel): void {
    this.videoClicked.emit({video: $event, videos: this.uploadedVideos});
  }

}
