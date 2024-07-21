import { Component } from '@angular/core';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import {ConferenceMessage} from '../../../../_core/model/conference';

@Component({
  selector: 'app-raise-hand-button',
  templateUrl: './raise-hand-button.component.html',
  styleUrls: ['./raise-hand-button.component.scss']
})
export class RaiseHandButtonComponent {

  isHandRaised = false;

  constructor() { }

  raiseHand(): void {
    if (VoxeetSDK.conference.current) {
      this.isHandRaised = !this.isHandRaised;
      const message: ConferenceMessage = {
        participant: null,
        action: ConferenceInteraction.RAISE_HAND
      };
      VoxeetSDK.command.send(JSON.stringify(message));
    }
  }
}

export enum ConferenceInteraction {
  RAISE_HAND = 'RAISE_HAND',
  ENABLE_AUDIO = 'ENABLE_AUDIO',
  DISABLE_AUDIO = 'DISABLE_AUDIO',
  INVITE_ACCEPTED = 'INVITE_ACCEPTED',
  INVITE_DECLINED = 'INVITE_DECLINED',
  JOIN_FAILED = 'JOIN_FAILED'
}
