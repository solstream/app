import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AccountModel} from '../../../../../../_core/model/accountModel';
import {ChannelsService} from '../../../../../../_core/services/channels.service';
import {StreamViewService} from '../../../../../../_core/services/stream-view.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {LocalStorageService} from '../../../../../../_core/services/auth-store.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuditService} from '../../../../../../_core/services/audit.service';
import {ChannelContentService} from '../../../../../../_core/services/channel-content.service';
import {MessageComponentState} from '../../../../../../@mvp/shared-components/chat/channel-live-actions.service';
import {ChatService, MessageApiModel} from '../../../../../../_core/services/chat.service';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import {constantEmoji} from '../../../../../../constant-emoji';
import {Constants} from '../../../../../../_core/constants/constants';
import {interval} from 'rxjs';
import {CurrentUserState} from '../../../../../../_core/services/current-user-state.service';
import {VideoState} from '../../../../../../_core/model/video.model';
import {ConferenceInteraction} from '../../../../../../@mvp/shared-components/buttons/raise-hand-button/raise-hand-button.component';
import {ConferenceMessage} from '../../../../../../_core/model/conference';
import {DolbyIoVideoPlayerComponent} from '../../../../../../@mvp/shared-components/dolby-io-video-player/dolby-io-video-player.component';

@Component({
    selector: 'app-live-stream-view',
    templateUrl: './live-stream-view.component.html',
    styleUrls: ['./live-stream-view.component.scss']
})
export class LiveStreamViewComponent implements OnInit, OnDestroy {

    destroyed = false;
    userName = '';
    isInTheRoom = false;
    connectedRoomName = '';
    subs = null;
    @Input()
    room: AccountModel = null;
    conferenceEndedListener = null;

    @Output()
    joined = new EventEmitter();

    @Output()
    conferenceCreated = new EventEmitter();

    @Output()
    joinFailed = new EventEmitter();

    @Output()
    conferenceEnded = new EventEmitter();

    @Output()
    videoEvent = new EventEmitter();

    @Input()
    carousel = false;
    checkInSubscription = null;

    isInvited = false;

    @ViewChild(DolbyIoVideoPlayerComponent) dolbyIoVideoPlayer: DolbyIoVideoPlayerComponent;

    constructor(private roomService: ChannelsService,
                private streamViewService: StreamViewService,
                private cus: CurrentUserState,
                private authStore: LocalStorageService,
                private router: ActivatedRoute,
                private auditService: AuditService,
                private channelService: ChannelContentService,
                private router1: Router,
                private action: MessageComponentState,
                private chatService: ChatService) {
    }

    ngOnInit(): void {
        this.destroyed = false;
        const roomName = this.room.roomName;
        this.userName = this.cus.isLoggedIn() ? this.cus.getAccountName() : this.cus.getNonLoggedInUserName();
        this.joinStream(this.room.conferenceId, roomName).then(() => {
            this.auditService.updatePodcastViews(this.room.roomName, this.userName).subscribe(() => {
                if (!this.carousel) {
                    this.initCheckIn();
                    if (this.cus.isLoggedIn()) {
                        this.postWelcomeRoomBotMessage();
                    }
                }
            });
        });
    }

    onPlay($event): void {
        this.videoEvent.emit(VideoState.PLAYING);
    }

    onPause($event): void {
        this.videoEvent.emit(VideoState.PAUSED);
    }

    async joinStream(conferenceId: string, roomName: string): Promise<void> {
        this.isInTheRoom = true;
        const conf = VoxeetSDK.conference.current;
        if (conf) {
            await VoxeetSDK.conference.leave();
        }

        try {
            const session = await this.streamViewService.createSessionForUser(this.userName);
            const conferenceObj = await VoxeetSDK.conference.fetch(conferenceId);
            const conference = await VoxeetSDK.conference.join(conferenceObj, {constraints: {audio: false, video: false, simulcast: false}});

            this.isInTheRoom = true;
            this.connectedRoomName = roomName;
            this.joined.next(true);
            this.conferenceCreated.emit(conference.alias);
            this.action.joinRoom.next({
                liveAccountId: this.room.id,
                connectedUserAccountId: this.cus.getCurrentUserRoom()?.roomId,
                roomName,
                confId: conference.id
            });
            this.subs = this.action.getRoomLeaving(this.connectedRoomName).subscribe(() => {
                this.leaveRoom();
            });

            await this.dolbyIoVideoPlayer.init(conference);

            VoxeetSDK.command.on('received', (participant, message) => this.onMessageReceived(JSON.parse(message) as ConferenceMessage));
            this.conferenceEndedListener = VoxeetSDK.notification.on('conferenceEnded', () => this.streamViewService.showAudioControls.next(false));
        } catch (e) {
            this.joinFailed.next();
            console.log('Listening conference failed' + e);
        }
    }

    async onMessageReceived(message: ConferenceMessage): Promise<void> {
        if (message.participant?.info.name !== this.userName) {
            return;
        }

        switch (message.action) {
            case ConferenceInteraction.ENABLE_AUDIO:
                this.isInvited = true;
                break;
            case ConferenceInteraction.DISABLE_AUDIO:
                await this.disableAudio();
                break;
            default:
                break;
        }
    }

    async join(): Promise<void> {
        await this.enableAudio();
        this.isInvited = false;
    }

    async decline(): Promise<void> {
        const message: ConferenceMessage = {
            participant: null,
            action: ConferenceInteraction.INVITE_DECLINED
        };
        await VoxeetSDK.command.send(JSON.stringify(message));
        this.isInvited = false;
    }

    async enableAudio(): Promise<void> {
        try {
            console.log(`starting my audio`);
            await VoxeetSDK.conference.startAudio(VoxeetSDK.session.participant);
            this.streamViewService.showAudioControls.next(true);

            const message: ConferenceMessage = {
                participant: null,
                action: ConferenceInteraction.INVITE_ACCEPTED
            };
            await VoxeetSDK.command.send(JSON.stringify(message));
        } catch (e) {
            // Send message user failed joined
            const message: ConferenceMessage = {
                participant: null,
                action: ConferenceInteraction.JOIN_FAILED
            };
            await VoxeetSDK.command.send(JSON.stringify(message));
            console.error(e);
        }
    }

    async disableAudio(): Promise<void> {
        try {
            console.log(`disabling my audio`);
            await VoxeetSDK.conference.stopAudio(VoxeetSDK.session.participant);
            this.streamViewService.showAudioControls.next(false);
        } catch (e) {
            console.error(e);
        }
    }


    private leaveRoom(): any {
        return VoxeetSDK.conference.leave().then(() => {
            this.isInTheRoom = false;
            return true;
        });
    }

    private postWelcomeRoomBotMessage(): void {
        const usernameBotConf = this.authStore.getWelcomeRoomBotConf() ? this.authStore.getWelcomeRoomBotConf().split('/') : undefined;
        if (!usernameBotConf || usernameBotConf[0] !== this.userName || usernameBotConf[1] !== this.room.conferenceId) {
            this.authStore.setWelcomeRoomBotConf(this.userName + '/' + this.room.conferenceId);
            const messageApi: MessageApiModel = {
                confId: this.room.conferenceId,
                roomName: this.room.roomName,
                userName: this.room.roomName + '/helper',
                text: constantEmoji.hello
                    + ' ' + Constants.WELCOME_ROOM_BOT_MSG[Math.floor(Math.random() * Constants.WELCOME_ROOM_BOT_MSG.length)]
                    + ' ' + this.cus.currentUserAccount$.value.roomName
            };
            this.chatService.createMessage(messageApi).subscribe();
        }
    }

    initCheckIn(): any {
        this.checkInSubscription = interval(10000).subscribe(() => {
            this.channelService.checkInRoom(this.connectedRoomName, this.userName).subscribe();
        });
    }

    ngOnDestroy(): void {
        this.destroyed = true;
        if (this.subs !== null) {
            this.subs.unsubscribe();
        }
        if (this.checkInSubscription !== null) {
            this.checkInSubscription.unsubscribe();
        }
        this.conferenceEndedListener.removeAllListeners();
        VoxeetSDK.conference.leave().then(() => {
        }).catch(() => {
        });
    }
}
