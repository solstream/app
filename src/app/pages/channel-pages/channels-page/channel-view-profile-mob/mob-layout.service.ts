import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobLayoutService {

  constructor() { }

  adjustOtherContent(): void {
    const video = document.getElementById('player-content');
    const topbar = document.getElementById('top-bar-container');
    const content = document.getElementById('other-content');
    if (content) {
      content.style.paddingTop = topbar.offsetHeight + video.offsetHeight + 'px';
    }
  }

  adjustLayoutAfterCommentsVisibilityChange(show: boolean): void {
    const video = document.getElementById('player-content');
    const topbar = document.getElementById('top-bar-container');
    const content = document.getElementById('other-content');
    const message = document.getElementById('message-container');
    const height = topbar.offsetHeight + video.offsetHeight + 'px';
    message.style.top = topbar.offsetHeight + video.offsetHeight + 'px';
    message.style.height = `calc(100% - ${height})`;
    message.style.position = 'fixed';
    message.style.width = '100%';
    message.style.display = show ? 'block' : 'none';
    content.style.display = show ? 'none' : 'block';
  }

  scrollTop(): void {
    const scrollContainer = document.getElementById('other-content');
    const scrollContainer1 = document.getElementById('channel-videos-mob');
    const scrollContainer2 = document.getElementById('body');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      scrollContainer1.scrollTop = 0;
      scrollContainer2.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }

}
