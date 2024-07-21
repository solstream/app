import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import {RoomActions} from '../../../../../account-pages/host-account-live-page/participants-implement/room.actions';
import {Participant} from '@voxeet/voxeet-web-sdk/types/models/Participant';
import {ParticipantJoinedNotification, ParticipantLeftNotification} from '@voxeet/voxeet-web-sdk/types/events/notification';

@Component({
    selector: 'app-channel-view-participants',
    templateUrl: './participants.component.html',
    styleUrls: ['./participants.component.scss']
})
export class ChannelViewParticipantsComponent implements OnInit {

    confParticipants: Participant[] = [];

    @Input()
    disabled = false;

    @Input()
    alias;

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

        VoxeetSDK.conference.participants.forEach(part => {
            const participantInConference = this.confParticipants.find(p => p.id === part.id);

            if (part.status === 'Connected' && !participantInConference) {
                this.confParticipants.push(part);
            }
        });

        VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
            const participantInConference = this.confParticipants.find(p => p.id === participant.id);

            if (!participantInConference) {
                this.confParticipants.push(participant);
            }
        });

        VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
            this.confParticipants = this.confParticipants.filter(p => p.id !== participant.id);
        });

    }

}
