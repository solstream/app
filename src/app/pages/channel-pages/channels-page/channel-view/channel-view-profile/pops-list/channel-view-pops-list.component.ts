import {Component, EventEmitter, Input, Output} from '@angular/core';
import {VideoModel} from '../../../../../../_core/model/video.model';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-channel-view-pops-list',
  templateUrl: './channel-view-pops-list.component.html',
  styleUrls: ['./channel-view-pops-list.component.scss']
})
export class ChannelViewPopsListComponent {

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
