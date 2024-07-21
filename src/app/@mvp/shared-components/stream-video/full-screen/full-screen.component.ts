import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {faCompress, faExpand} from '@fortawesome/free-solid-svg-icons';
import {CinemaActions} from '../../../../_core/cinema.actions';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../../../../_core/services/auth-store.service';
import {StreamerContextState} from '../../../../pages/account-pages/host-account-live-page/stream-context-state.service';

// TODO as a full-screen feature not used anymore. but some funtionaliy of it is in use, refacting needed.
@Component({
    selector: 'app-full-screen',
    templateUrl: './full-screen.component.html',
    styleUrls: ['./full-screen.component.scss']
})
export class FullScreenComponent implements OnInit, OnDestroy {

    @Input()
    hasFullScreen = true;

    @Input()
    htmlItemId = 'stream-container';

    @Input()
    screenShareId = 'screen-share';

    @Input()
    fullScreenOn = false;

    expandIcon = faExpand;
    compressIcon = faCompress;

    cornerNodeClone = null;
    screenShareIsOn = false;
    destroyed = false;


    constructor(private actions: CinemaActions,
                private roomState: StreamerContextState,
                private client: HttpClient,
                private authStore: LocalStorageService) {
    }

    ngOnInit(): void {
    }

    toggleFullScreen(): void {
        if (this.destroyed) {
            return;
        }
        if (!this.fullScreenOn) {
            this.fullScreenOn = !this.fullScreenOn;
            this.setup(this.htmlItemId);
            if (this.screenShareIsOn) {
                this.setup('screen-observer');
                this.setVideoInLeftrightCorner();
            } else {
                this.setup('video-observer');
            }
        } else {
            this.fullScreenOn = !this.fullScreenOn;
            this.unSetup(this.htmlItemId);
            if (this.screenShareIsOn) {
                this.unSetup('screen-observer');
                this.minimizeNode();
            } else {
                this.unSetup('video-observer');
            }
        }
    }

    private setVideoInLeftrightCorner(): void {
        if (this.destroyed) {
            return;
        }
        const fullScreenNode = document.getElementById('video-observer');
        fullScreenNode.style.position = 'fixed';
        fullScreenNode.style.bottom = '5px';
        fullScreenNode.style.left = '5px';
    }

    private unSetup(fullScreenItem: string): void {
        if (this.destroyed) {
            return;
        }
        const fullScreenNode = document.getElementById(fullScreenItem);
        fullScreenNode.removeAttribute('style');
        if (fullScreenItem === 'stream-container') {
            fullScreenNode.style.height = '100%';
            fullScreenNode.style.width = '100%';
        } else {
            fullScreenNode.style.height = '100%';
            fullScreenNode.style.width = '100%';
        }
    }

    private setup(fullScreenItem: string): void {
        if (this.destroyed) {
            return;
        }
        const fullScreenNode = document.getElementById(fullScreenItem);
        fullScreenNode.style.position = 'fixed';
        fullScreenNode.style.top = '0';
        fullScreenNode.style.backgroundColor = 'black';
        fullScreenNode.style.left = '0';
        fullScreenNode.style.height = '100%';
        fullScreenNode.style.width = '100%';
    }


    removeScreenShareNode(): void {
        if (this.destroyed) {
            return;
        }
        const screenShareNode = document.getElementById('screen-observer');
        if (screenShareNode) {
            screenShareNode.parentNode.removeChild(screenShareNode);
        }
    }

    addStreamNode(stream: MediaStream, videoElementID, isHost = false): void {
        if (this.destroyed) {
            return;
        }
        const screenStreamON = this.screenShareIsOn;
        const videoContainer = document.getElementById('stream-container');
        let newVideoElement = document.getElementById(videoElementID) as HTMLVideoElement;

        if (!newVideoElement) {

            newVideoElement = document.createElement('video') as HTMLVideoElement;
            newVideoElement.setAttribute('id', videoElementID);
            newVideoElement.style.height = '100%';
            newVideoElement.style.width = '100%';
            // newVideoElement.setAttribute('autoplay', '');
            // newVideoElement.setAttribute('muted', '');
            newVideoElement.setAttribute('playsinline', '');
            newVideoElement.setAttribute('webkit-playsinline', '');

            if (isHost) {
                this.captureVideoStream(stream);
            }

            newVideoElement.srcObject = stream;

            if (videoElementID === 'screen-observer') {
                const videoEl = document.getElementById('video-observer');
                if (videoEl) {
                    videoContainer.insertBefore(newVideoElement, videoContainer.children[0]);
                } else {
                    videoContainer.appendChild(newVideoElement);
                }
            } else {
                console.warn('else');
                videoContainer.appendChild(newVideoElement);
            }
            if (videoElementID === 'video-observer' && screenStreamON === true) {
                this.minimizeNode();
            }

            const startPlayPromise = newVideoElement.play();
            if (startPlayPromise !== undefined) {
                startPlayPromise.then(() => {
                    console.log('paying');
                }).catch(error => {
                    if (error.name === 'NotAllowedError') {
                        newVideoElement.muted = true;
                        newVideoElement.play().then(() => {
                            console.log('paying attemt 2');
                        });
                    }
                });
            }
        }

    }

    private captureVideoStream(stream): void {
        const roomName = this.roomState.hostRoom$.value.roomName;
        const track = stream.getVideoTracks()[0];
        const videoCapture = new ImageCapture(track);
        videoCapture.takePhoto().then((uu) => {
            const file = new File([uu], roomName);
            this.upload(file);
        });
    }

    // TODO move to service
    upload(file): void {
        const formData = new FormData();
        formData.append('file', file);
        const roomName = this.authStore.getSecurityUserName();
        this.client.post(environment.privateAzure + `/file/upload/conf-snapshot/${roomName}`, formData).subscribe((res) => {
        });
    }

    minimizeNode(): void {
        const videoNode = document.getElementById('video-observer') as HTMLVideoElement;
        if (videoNode) {
            videoNode.style.height = '85px';
            videoNode.style.width = '160px';
            videoNode.style.position = 'relative';
            videoNode.style.bottom = '95px';
            videoNode.style.zIndex = '2000';
        }
    }

    maximizeVideo(): void {
        const videoNode = document.getElementById('video-observer') as HTMLVideoElement;
        videoNode.style.height = '100%';
        videoNode.style.width = '100%';
        videoNode.style.bottom = '0';
        if (this.fullScreenOn) {
            videoNode.style.position = 'relative';
        } else {
            videoNode.style.position = 'static';
        }
    }

    ngOnDestroy(): void {
        this.destroyed = true;
    }

}
