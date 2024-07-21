import {Participant} from '@voxeet/voxeet-web-sdk/types/models/Participant';
import {ConferenceInteraction} from '../../@mvp/shared-components/buttons/raise-hand-button/raise-hand-button.component';

export interface ConferenceParticipant {
    participant: Participant;
    handRaised: boolean;
    pendingInvite: boolean;
    rejectedInvite: boolean;
    inConference: boolean;
}

export interface ConferenceMessage {
    participant: Participant;
    action: ConferenceInteraction;
}

/**
 * The ConferencePermission model represents the possible permissions a participant may have in a conference.
 */
export enum ConferencePermission {
    /**
     * Allows a participant to invite participants to a conference.
     */
    Invite = 'INVITE',
    /**
     * Allows a participant to update other participants' permissions.
     */
    UpdatePermissions = 'UPDATE_PERMISSIONS',
    /**
     * Allows a participant to kick other participants from a conference
     */
    Kick = 'KICK',
    /**
     * Allows a participant to join a conference.
     */
    Join = 'JOIN',
    /**
     * Allows a participant to send an audio stream during a conference.
     */
    SendAudio = 'SEND_AUDIO',
    /**
     * Allows a participant to send a video stream during a conference.
     */
    SendVideo = 'SEND_VIDEO',
    /**
     * Allows a participant to share a screen during a conference.
     */
    ShareScreen = 'SHARE_SCREEN',
    /**
     * Allows a participant to share a video during a conference.
     */
    ShareVideo = 'SHARE_VIDEO',
    /**
     * Allows a participant to share a file during a conference.
     */
    ShareFile = 'SHARE_FILE',
    /**
     * Allows a participant to send a message to other participants during a conference.
     */
    SendMessage = 'SEND_MESSAGE',
    /**
     * Allows a participant to record a conference.
     */
    Record = 'RECORD',
    /**
     * Allows a participant to stream a conference.
     */
    Stream = 'STREAM'
}

