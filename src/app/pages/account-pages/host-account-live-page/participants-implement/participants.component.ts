import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import {faComment, faUsers} from '@fortawesome/free-solid-svg-icons';
import {RoomActions} from './room.actions';
import {ParticipantJoinedNotification, ParticipantLeftNotification} from '@voxeet/voxeet-web-sdk/types/events/notification';
import {ConferenceInteraction} from '../../../../@mvp/shared-components/buttons/raise-hand-button/raise-hand-button.component';
import {ConferenceMessage, ConferenceParticipant} from '../../../../_core/model/conference';
import {Participant} from '@voxeet/voxeet-web-sdk/types/models/Participant';

// TODO: rename or move component to be part of host-account-live-page
@Component({
    selector: 'app-participants',
    templateUrl: './participants.component.html',
    styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {

    commentIcon = faComment;
    userIcon = faUsers;

    confParticipants: ConferenceParticipant[] = [];

    @Input()
    disabled = false;

    @Output()
    actionClicked = new EventEmitter();

    @Input()
    showActions = false;

    constructor(private roomActions: RoomActions) {
    }

    ngOnInit(): void {
        this.confParticipants = [];
        this.roomActions.$conferenceClosed.subscribe(() => {
            this.confParticipants = [];
            this.disabled = true;
        });

        const alias = VoxeetSDK.conference.current.alias;
        const subscriptionsToEnable: any = [
            { type: 'Conference.ActiveParticipants', conferenceAlias: alias  },
            { type: 'Participant.Joined', conferenceAlias: alias },
            { type: 'Participant.Left', conferenceAlias: alias },
        ];
        VoxeetSDK.notification
            .subscribe(subscriptionsToEnable)
            .then(() => console.log('subscription success'));

        VoxeetSDK.notification.on('participantJoined', (event: ParticipantJoinedNotification) => {
            if (event.participant.info.name.includes('USER-')) {
                return;
            }
            this.confParticipants.push({
                participant: event.participant,
                pendingInvite: false,
                rejectedInvite: false,
                handRaised: false,
                inConference: false
            });
        });
        VoxeetSDK.notification.on('participantLeft', (event: ParticipantLeftNotification) => {
            this.confParticipants = this.confParticipants.filter(p => p.participant.id !== event.participant.id);
        });

        VoxeetSDK.command.on('received', (participant: Participant, message) =>
            this.onMessageReceived(participant, JSON.parse(message) as ConferenceMessage));

        VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
            this.confParticipants.map(p => p.participant.id === participant.id ? p.inConference = true : null);
        });

        VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
            this.confParticipants.map(p => p.participant.id === participant.id ? p.inConference = false : null);
        });
    }

    getInitials(name: string): string {
        const names = name.split(' ');
        if (names.length > 1) {
            const initial = names[0].charAt(0) + names[1].charAt(0);
            return initial;
        }
        return name.charAt(0);
    }

    onMessageReceived(participant: Participant, message: ConferenceMessage): void {
        const confParticipant = this.confParticipants.find(p => p.participant.id === participant.id);

        switch (message.action) {
            case ConferenceInteraction.RAISE_HAND:
                confParticipant.handRaised = !confParticipant.handRaised;
                break;
            case ConferenceInteraction.INVITE_ACCEPTED:
                confParticipant.pendingInvite = false;
                break;
            case ConferenceInteraction.JOIN_FAILED:
            case ConferenceInteraction.INVITE_DECLINED:
                confParticipant.pendingInvite = false;
                confParticipant.rejectedInvite = true;
                setTimeout(() => {
                    confParticipant.rejectedInvite = false;
                }, 2000);
                break;
            default:
                break;
        }

    }

    async enableAudio({ participant }: ConferenceParticipant): Promise<void> {
        try {
            const message: ConferenceMessage = {
                participant,
                action: ConferenceInteraction.ENABLE_AUDIO
            };
            await VoxeetSDK.command.send(JSON.stringify(message));
            this.confParticipants.map(p => p.participant.id === participant.id ? p.pendingInvite = true : null);
        } catch (e) {
            console.error(e);
        }
    }

    async disableAudio({ participant }: ConferenceParticipant): Promise<void> {
        try {
            const message: ConferenceMessage = {
                participant,
                action: ConferenceInteraction.DISABLE_AUDIO
            };
            await VoxeetSDK.command.send(JSON.stringify(message));
        } catch (e) {
            console.error(e);
        }
    }

}
