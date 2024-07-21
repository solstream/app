import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FullScreenComponent} from '../../../../@mvp/shared-components/stream-video/full-screen/full-screen.component';
import {LocalStorageService} from '../../../../_core/services/auth-store.service';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import {ActivatedRoute} from '@angular/router';
import {
    MessageComponentState
} from '../../../../@mvp/shared-components/chat/channel-live-actions.service';
import {ChannelsService} from '../../../../_core/services/channels.service';
import {interval} from 'rxjs';
import {SnapshotsService} from '../snapshots.service';
import {RouterService} from '../../../../_core/services/router.service';
import {StreamViewService} from '../../../../_core/services/stream-view.service';
import {MatDialog} from '@angular/material/dialog';
import {StreamDetailsModalComponent} from './stream-details-modal/stream-details-modal.component';
import {AccountModel} from '../../../../_core/model/accountModel';
import {StreamerContextState} from '../stream-context-state.service';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';
import {DolbyIoVideoPlayerComponent} from '../../../../@mvp/shared-components/dolby-io-video-player/dolby-io-video-player.component';

@Component({
    selector: 'app-host-stream',
    templateUrl: './host-stream.component.html',
    styleUrls: ['./host-stream.component.scss']
})
export class HostStreamComponent implements OnInit, OnDestroy {

    sharingScreen = false;
    podcast: any;

    @Input()
    hostRoom: AccountModel = null;

    @Output()
    screenShared = new EventEmitter();

    @Output()
    conferenceCreated = new EventEmitter();

    @ViewChild(DolbyIoVideoPlayerComponent, {static: true})
    dolbyIoVideoPlayer: DolbyIoVideoPlayerComponent;

    userName = '';
    avatarUrl = '';
    sub1 = null;
    sub2 = null;
    sub3 = null;

    roomId = null;
    conferenceId = null;
    destroyed = false;

    liveStatusUpdateSubscription = null;

    streamTitle: string = null;
    videoEnabled: boolean;
    inviteEnabled: boolean;

    stream = null;
    videoCaptureSubscription = null;

    conferenceLeft = false;


    constructor(private routerService: RouterService,
                private messageComponentState: MessageComponentState,
                private streamingContextState: StreamerContextState,
                private roomService: ChannelsService,
                private activatedRoute: ActivatedRoute,
                private snapshotService: SnapshotsService,
                private svs: StreamViewService,
                private cus: CurrentUserState,
                public dialog: MatDialog,
                private authStore: LocalStorageService) {
    }


    ngOnInit(): void {
        this.roomId = this.activatedRoute.snapshot.paramMap.get('roomId');
        this.userName = this.cus.currentUser$.value.username;
        this.avatarUrl = this.cus.currentUserAccount$.value.avatarAzureUrl;
        if (this.roomId !== this.cus.currentUserAccount$.value.id) {
            this.routerService.navigateHome();
        }
        this.openStartPodcastModal();
    }

    openStartPodcastModal(): void {
        this.dialog.open(StreamDetailsModalComponent, {disableClose: true, width: '400px'})
            .afterClosed().subscribe(result => {
            if (result.cancel) {
                this.routerService.navigateToMyTv(this.hostRoom.roomName);
                return;
            }
            this.streamTitle = result.title;
            this.videoEnabled = result.videoEnabled;
            this.inviteEnabled = result.inviteEnabled;
            this.streamingContextState.initializeState(this.streamTitle, this.videoEnabled);
            this.initLiveStreaming();
            this.subscribeToScreenShare();
            this.subscribeToLiveFinished();
            this.screenShareCapture();
        });
    }

    private initLiveStreaming(): void {
        this.startStreaming(this.hostRoom.userName).then(() => {
            VoxeetSDK.notification.on('conferenceEnded', (participant, stream) => {
                console.log('Conference has ended' + participant.info.name);
            });
        });
    }


    private subscribeToLiveFinished(): void {
        this.sub2 = this.streamingContextState.live$.subscribe((live) => {
            if (live !== true) {
                if (this.sharingScreen) {
                    this.stopScreenShare();
                }
                this.stopStreaming();
            }
        });
    }

    private subscribeToScreenShare(): void {
        this.sub1 = this.streamingContextState.screenShare$.subscribe((shareScreen) => {
            if (shareScreen) {
                this.startScreenShare();
            } else if (this.sharingScreen) {
                this.stopScreenShare();
            }
        });
    }

    private subscribeToVideo(): void {
        this.sub3 = this.streamingContextState.video$.subscribe((video) => {

            if (video) {
                this.startVideo();
            } else {
                this.stopVideo();
            }
        });
    }

    private screenShareCapture(): void {
        VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
            if (stream.type === 'Camera') {
            }
            if (stream.type === 'ScreenShare') {
                this.snapshotService.captureVideoStream(stream, 'screen-snapshot');
            }
        });
    }

    async startStreaming(alias: string): Promise<void> {
        this.roomService.preStartLive(this.roomId).subscribe(async () => {
            const customerKey = VoxeetSDK.session.customerKey;
            if (customerKey) {
                try {
                    await VoxeetSDK.session.refreshAccessToken();
                    await VoxeetSDK.session.close();
                } catch (e) {
                    console.log(e);
                }
            }
            // TODO use svs service which is injected
            this.createSessionForUser()
                .then(() => {
                    const recordingOn = this.streamingContextState.recordStream$.value;
                    VoxeetSDK.conference.create({alias, params: {liveRecording: recordingOn}})
                        .then((conference) => {
                            this.dolbyIoVideoPlayer.init(conference, true).then(() => {
                                VoxeetSDK.conference.join(conference, {constraints: {audio: true, video: this.videoEnabled, simulcast: false}})
                                    .then(() => {
                                        console.log(`conference created with conference id ${conference.id}`);
                                        this.conferenceId = conference.id;
                                        this.messageComponentState.joinRoom.next({liveAccountId: this.cus.getCurrentUserRoom().id, connectedUserAccountId: this.cus.getCurrentUserRoom().id, roomName: alias, confId: conference.id});
                                        this.addUserVideoToTheStreamAndInitializeSnapshotJob();
                                        this.initHostCheckInForLiveStatus();
                                        this.conferenceCreated.next({ conferenceId: conference.id, inviteEnabled: this.inviteEnabled });
                                        this.subscribeToVideo();
                                        if (recordingOn) {
                                            VoxeetSDK.recording.start();
                                        }
                                    })
                                    .catch(e => {
                                        console.log(e);
                                    });
                            });
                        }).catch(e => {
                        console.log(e);
                    });
                });

        });
    }

    private addUserVideoToTheStreamAndInitializeSnapshotJob(): void {
        const video: any = document.querySelector('#video');
        setTimeout(() => {
            this.roomService.createPublicStream(this.hostRoom.id,
                this.conferenceId,
                this.streamTitle,
                this.streamingContextState.recordStream$.value)
                .subscribe((podcast) => {
                    this.podcast = podcast;
                    this.uploadStreamingSnapshot(video);
                });

        }, 3000);
        setInterval(() => {
                this.uploadStreamingSnapshot(video);
            }, 20000
        );
    }

    private uploadStreamingSnapshot(video: any): void {
        if (this.destroyed) {
            return;
        }
        const canvasElement: any = document.querySelector('#canvas');
        canvasElement.getContext('2d').drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        canvasElement.toBlob((blob) => {
            this.snapshotService.capturePodcastSnapshot(blob, this.podcast.id).subscribe();
        });
    }

    createSessionForUser(): any {
        VoxeetSDK.initialize(this.authStore.getDolbyKey(), this.authStore.getDolbySecret());
        return VoxeetSDK.session.open({name: this.userName, avatarUrl: this.avatarUrl});
    }

    startVideo(): void {
        console.log('starting video');
        VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant, true)
            .then(() => {
                this.videoEnabled = true;
            })
            .catch(e => {
                this.videoEnabled = false;
            });
    }

    stopVideo(): void {
        console.log('stopping video');
        VoxeetSDK.conference.stopVideo(VoxeetSDK.session.participant)
            .then(() => {
                this.videoEnabled = false;
            })
            .catch(e => {
                this.videoEnabled = true;
            });
    }

    startScreenShare(): void {
        VoxeetSDK.conference.startScreenShare()
            .then(() => {
                this.sharingScreen = true;
            })
            .catch(e => {
                this.sharingScreen = false;
            });
    }

    stopScreenShare(): void {
        VoxeetSDK.conference.stopScreenShare()
            .then(() => {
                this.sharingScreen = false;
            })
            .catch(e => {
                this.sharingScreen = true;
            });
    }

    stopStreaming(): void {
        setTimeout(async () => {
                this.stopVideoNodeStream();
                if (this.streamingContextState.recordStream$.value) {
                    await VoxeetSDK.recording.stop();
                }
                VoxeetSDK.conference.leave()
                    .then(() => {
                        // event is fired 6-7 times instead of one, workaround
                        if (this.conferenceLeft) {
                            return;
                        }
                        console.log('leave');
                        VoxeetSDK.session.close()
                            .then(() => {
                                this.conferenceLeft = true;
                                console.log('close');
                                this.adjustUIStateAndTerminateInBE();

                            }).catch((e) => {
                            this.conferenceLeft = true;
                            console.error('session close error', e);
                            this.adjustUIStateAndTerminateInBE();
                        });
                    })
                    .catch((e) => {
                        this.conferenceLeft = true;
                        console.log('Issue while leaving call:' + e);
                        this.adjustUIStateAndTerminateInBE();
                    });
            },
            10);
    }

    // Need to terminate session in BE to close it for all participants
    private adjustUIStateAndTerminateInBE(): void {
        this.roomService.stopPodcast(this.podcast.id).subscribe(() => {
            console.log('podcast record was created and streaming was terminated');
            console.log(this.hostRoom.userName);
        });
        this.streamingContextState.clearState();
        this.routerService.navigateToMyTv(this.hostRoom.roomName);
        this.liveStatusUpdateSubscription.unsubscribe();
    }

    private stopVideoNodeStream(): void {
        const videoNode = document.getElementById('video') as any;
        const stream = videoNode.srcObject;
        if (!stream) {
            return;
        }
        stream.getVideoTracks().forEach((track: MediaStreamTrack) => {
            track.stop();
        });
        videoNode.srcObject = null;
    }

    private initHostCheckInForLiveStatus(): void {
        this.liveStatusUpdateSubscription = interval(5000).subscribe(() => {
            this.roomService.liveStatusCheckIn(this.hostRoom.roomName, this.userName).subscribe();
        });
    }

    ngOnDestroy(): void {
        if (this.sub1) {
            this.sub1.unsubscribe();
        }
        if (this.sub2) {
            this.sub2.unsubscribe();
        }
        if (this.sub3) {
            this.sub3.unsubscribe();
        }
        if (this.liveStatusUpdateSubscription) {
            this.liveStatusUpdateSubscription.unsubscribe();
        }
        this.destroyed = true;
    }
}
