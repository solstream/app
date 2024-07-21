import {Component, Input, OnInit} from '@angular/core';
import {VideoType2} from '../../_core/model/video.model';

@Component({
  selector: 'app-video-chip',
  templateUrl: './video-chip.component.html',
  styleUrls: ['./video-chip.component.scss']
})
export class VideoChipComponent implements OnInit {


  @Input()
  videoType: VideoType2;

  @Input()
  isCarousel = false;

  constructor() { }

  ngOnInit(): void {
  }

  isLive(): boolean {
    return [VideoType2.LIVE_PEER_LIVE, VideoType2.PODCAST_LIVE].indexOf(this.videoType) > -1;
  }

  isRecord(): boolean {
    return [VideoType2.LIVE_PEER_RECORD, VideoType2.PODCAST_RECORD].indexOf(this.videoType) > -1;
  }

  isUpload(): boolean {
    return [VideoType2.UPLOADED_VIDEO].indexOf(this.videoType) > -1;
  }

}
