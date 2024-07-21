import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ChannelViewVideoUIService {
    //TODO consider angular Renderer2

    // moveVideoToOriginalPosition(): void {
    //     const videoElement = document.getElementById('videoPlayer');
    //     videoElement.style.position = null;
    //     videoElement.style.top = null;
    //     videoElement.style.right = null;
    //     videoElement.style.zIndex = null;
    //     videoElement.style.height = null;
    //     videoElement.style.width = null;
    //
    //     const commentElement = document.getElementById('comments');
    //     commentElement.style.height = '100%';
    //
    //     const videoContainer = document.getElementById('channelViewVideoContainer');
    //     videoContainer.style.height = null;
    //     videoContainer.style.width = null;
    //     videoContainer.style.display = null;
    //
    //     const audiControlsElement = document.getElementById('audio-controls-container');
    //     audiControlsElement.style.display = 'initial';
    //
    // }
    //
    // moveVideoRight(): void {
    //     const videoElement = document.getElementById('videoPlayer');
    //     const commentElement = document.getElementById('comments');
    //     const audiControlsElement = document.getElementById('audio-controls-container');
    //     const videoContainer = document.getElementById('channelViewVideoContainer');
    //     const rightContainer = document.getElementById('rightContainer');
    //     videoContainer.style.height = '100%;'
    //     videoContainer.style.width = '100%';
    //     videoContainer.style.display = 'block';
    //     videoElement.style.position = 'absolute';
    //     videoElement.style.top = '61px';
    //     videoElement.style.right = '0';
    //     videoElement.style.zIndex = '99999999';
    //     videoElement.style.width = rightContainer.offsetWidth + 'px';
    //     audiControlsElement.style.display = 'none';
    //
    //     const newCommentsHeight = rightContainer.offsetHeight - videoElement.offsetHeight + 20;
    //     commentElement.style.height = newCommentsHeight + 'px';
    //
    // }
}
