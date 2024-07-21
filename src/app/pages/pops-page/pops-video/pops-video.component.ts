import { Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {VideoModel} from '../../../_core/model/video.model';
import {RouterService} from '../../../_core/services/router.service';

@Component({
  selector: 'app-pops-video',
  templateUrl: './pops-video.component.html',
  styleUrls: ['./pops-video.component.scss']
})
export class PopsVideoComponent implements OnInit {

  videoEl: any;

  @Input() popVideo: VideoModel;
  @HostListener('window:mousewheel', [])
  onWindowScroll(): void {
    setTimeout(() => {
      if (this.isInViewport()) { this.playVideo(); }
      if (!this.isInViewport()) { this.pauseVideo(); }
    }, 500);
  }

  constructor(public element: ElementRef,
              private routerService: RouterService) {
  }

  ngOnInit(): void {
    this.videoEl = this.element.nativeElement.getElementsByTagName('video')[0];
    setTimeout(() => {
      if (this.isInViewport()) { this.playVideo(); }
    }, 500);
  }

  playVideo(): void {
    if (this.videoEl.paused) {
      this.videoEl.play();
      this.videoEl.setAttribute('loop', '');
    }
  }

  pauseVideo(): void {
    if (!this.videoEl.paused) {
      this.videoEl.pause();
    }
  }

  isInViewport(): boolean {
    const bounding = this.element.nativeElement.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight + 80 || document.documentElement.clientHeight) && // innerHeight + header
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  navigateToRoom(): void {
    return this.routerService.navigateToTheRoom(this.popVideo.roomName);
  }

}
