import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {VideoModel} from '../../../../../_core/model/video.model';
import * as Utils from 'src/app/_core/utils/utils';

@Component({
  selector: 'app-video-data',
  templateUrl: './video-data.component.html',
  styleUrls: ['./video-data.component.scss']
})
export class VideoDataComponent implements OnInit {

  @Input()
  video: VideoModel;

  @Input()
  showLiveStatus = true;

  @Input()
  enableNavigation = false;

  @Input()
  carousel = false;

  readonly solstreamToDollar = Utils.convertsolstreamToDollar;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToChannel(): void {
    // this.router.navigate([`home/${this.room.roomName}`]);
  }
}
