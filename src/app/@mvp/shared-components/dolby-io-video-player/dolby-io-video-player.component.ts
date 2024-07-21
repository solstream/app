import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Participant} from '@voxeet/voxeet-web-sdk/types/models/Participant';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';

@Component({
  selector: 'app-dolby-io-video-player',
  templateUrl: './dolby-io-video-player.component.html',
  styleUrls: ['./dolby-io-video-player.component.scss']
})
export class DolbyIoVideoPlayerComponent implements OnInit, OnDestroy {

  conferenceAlias: string;
  hostAvatarUrl;
  muteSound: boolean;

  hostVideoEnabled: boolean;
  videoStream;
  destroyed: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Setup listeners to show/hide camera and screenshare of the host
   * Component is being used by live-stream-view component & host-account-live
   * use init after joining a conference
   * @param conferenceObj
   */
  public init(conferenceObj: Conference, muteSound = false): Promise<void> {

    return new Promise((res, reject) => {
      this.muteSound = muteSound;
      this.conferenceAlias = conferenceObj.alias;
      conferenceObj.participants.forEach(participant => this.isHost(participant) ? this.hostAvatarUrl = participant.info.avatarUrl : null);

      VoxeetSDK.conference.on('streamAdded', (participant, stream) => this.onStreamAdded(participant, stream));
      VoxeetSDK.conference.on('streamUpdated', (participant, stream) => this.onStreamUpdated(participant));
      VoxeetSDK.conference.on('streamRemoved', (participant, stream) => this.onStreamRemoved(participant, stream));

      res();
    });

  }

  public onStreamRemoved(participant: Participant, stream: any): void {
    if (stream.type === 'ScreenShare') {
      if (participant.streams.length === 0 || !participant.streams[0].active) {
        // Host doesn't have camera enabled
        this.hostVideoEnabled = false;
        this.removeVideoNode();
      } else {
        this.addStreamNode(this.videoStream);
      }
    }
  }

  public onStreamUpdated(participant: Participant): void {
    if (this.destroyed || !this.isHost(participant)) { return; }

    const screenshareStream = participant.streams.find(str => str.type === 'ScreenShare');
    const video = screenshareStream ? screenshareStream : participant.streams[0];

    this.videoStream = participant.streams[0];

    if (participant.streams[0].active) {
      this.hostVideoEnabled = true;
      this.addStreamNode(video);
    } else {
      this.hostVideoEnabled = false;
      this.removeVideoNode();
    }
  }

  public onStreamAdded(participant: Participant, stream: any): void {
    if (this.destroyed || !this.isHost(participant)) { return; }


    if (stream.type === 'Camera') {
      if (!stream.active) {
        this.hostVideoEnabled = false;
        return;
      }
      this.addStreamNode(stream);
    }
    if (stream.type === 'ScreenShare') {
      this.hostVideoEnabled = true;
      this.addStreamNode(stream);
    }
  }

  private isHost(participant: Participant): boolean {
    return participant.info.name === this.conferenceAlias;
  }

  public removeVideoNode(videoElementID = 'video'): void {
    const videoElement = document.getElementById(videoElementID) as HTMLVideoElement;
    videoElement.srcObject = null;
    videoElement.muted = true;
    videoElement.controls = false;
  }

  private addStreamNode(stream: MediaStream, videoElementID = 'video'): void {
    const newVideoElement = document.getElementById(videoElementID) as HTMLVideoElement;
    newVideoElement.style.height = '100%';
    newVideoElement.style.width = '100%';

    newVideoElement.setAttribute('playsinline', '');
    newVideoElement.setAttribute('autoplay', 'autoplay');
    newVideoElement.setAttribute('webkit-playsinline', '');
    newVideoElement.setAttribute('preload', 'none');
    newVideoElement.srcObject = stream;

    if (this.muteSound) {
      newVideoElement.muted = true;
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }
}
