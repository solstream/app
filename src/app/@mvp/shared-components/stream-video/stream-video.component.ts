import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import {FullScreenComponent} from './full-screen/full-screen.component';
import {LocalStorageService} from '../../../_core/services/auth-store.service';
import {CinemaActions} from '../../../_core/cinema.actions';

@Component({
    selector: 'app-stream-video',
    templateUrl: './stream-video.component.html',
    styleUrls: ['./stream-video.component.scss']
})
export class StreamVideoComponent implements OnInit, OnDestroy {

    @ViewChild(FullScreenComponent, {static: true})
    fullScreenComponent: FullScreenComponent;

    @Output()
    conferenceEnded = new EventEmitter();

    becomeOffline = false;


    userName = '';
    destryed = false;

    constructor(private authStore: LocalStorageService,
                private cinemaActions: CinemaActions) {
    }

    ngOnInit(): void {
        this.userName = this.authStore.getUserNameObserver();
        VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
            if (this.destryed) {
                return;
            }
            this.showVideo();
            if (!participant.streams[0].getVideoTracks().length) {
                this.removeVideoNode();
            }
        });

        VoxeetSDK.notification.on('conferenceEnded', (participant, stream) => {
            if (this.destryed) {
                return;
            }
            console.log('Conference has ended' + participant.info.name);
        });

        VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
            if (stream.type === 'Camera') {
            }
            if (stream.type === 'ScreenShare') {
                if (this.destryed) {
                    return;
                }
                this.fullScreenComponent.screenShareIsOn = true;
                this.fullScreenComponent.addStreamNode(stream, 'screen-observer');
                this.fullScreenComponent.minimizeNode();
            }
        });

        VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
            if (this.destryed) {
                return;
            }
            if (stream.type === 'Camera') {
                VoxeetSDK.conference.leave().then(() => {
                    this.conferenceEnded.emit();
                }).catch(() => {
                    this.conferenceEnded.emit();
                });
            }

            if (stream.getVideoTracks().length) {
                this.removeVideoNode();
            }
            if (stream.type === 'ScreenShare') {
                this.fullScreenComponent.screenShareIsOn = false;
                this.fullScreenComponent.removeScreenShareNode();
                this.fullScreenComponent.maximizeVideo();
            }
        });
    }

    private showVideo(): void {
        const participantsList = VoxeetSDK.conference.participants;
        participantsList.forEach((value, key) => {
            if (value.id !== VoxeetSDK.session.participant.id) {
                if (value.streams[0] && value.streams[0].getVideoTracks().length) {
                    this.fullScreenComponent.addStreamNode(value.streams[0], 'video-observer');
                    document.getElementById('app-full-screen').style.left = '100px';
                    return;
                }
            }
        });
    }

    removeVideoNode(): void {
        const videoNode = document.getElementById('video-observer') as HTMLVideoElement;
        const videoNodeUndefined = document.getElementById('video-undefined') as HTMLVideoElement;

        if (videoNode) {
            // @ts-ignore
            videoNode.parentNode.removeChild(videoNode);
        }
        if (videoNodeUndefined) {
            // @ts-ignore
            videoNode.parentNode.removeChild(videoNodeUndefined);
        }
    }

    ngOnDestroy(): void {
        this.destryed = true;
    }

}
