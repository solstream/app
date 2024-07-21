import {Component, Input, OnInit} from '@angular/core';
import {VideoModel, VideoType2} from '../../../_core/model/video.model';
import {DeviceDetectorService} from 'ngx-device-detector';
import {VideoService} from '../../../_core/services/videos.service';
import {RouterService} from '../../../_core/services/router.service';

@Component({
  selector: 'app-home-pops',
  templateUrl: './home-pops.component.html',
  styleUrls: ['./home-pops.component.scss']
})
export class HomePopsComponent implements OnInit {

  @Input()
  uploadedVideo: VideoModel[];

  constructor(public mob: DeviceDetectorService,
              private uploadedVideosService: VideoService,
              private routerService: RouterService) {
  }

  ngOnInit(): void {
  }

  videoCardClicked($event: VideoModel): void {
    if ($event.videoType === VideoType2.PODCAST_LIVE) {
      this.routerService.navigateToTheRoom($event.roomName);
      return;
    }
    // this.routerService.navigateToPop($event.id);
    this.routerService.navigateToTheRoom($event.roomName);
  }
}
