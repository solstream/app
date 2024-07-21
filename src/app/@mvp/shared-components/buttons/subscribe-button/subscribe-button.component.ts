import {Component, Input} from '@angular/core';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';
import {RegistrationModalState, LoginPopupState} from '../../../login-popup/registration-modal-state.service';

@Component({
  selector: 'app-subscribe-button',
  templateUrl: './subscribe-button.component.html',
  styleUrls: ['./subscribe-button.component.scss']
})
export class SubscribeButtonComponent {

  disabled = false;
  @Input()
  channelId: string;

  constructor(private cus: CurrentUserState, private loginPopupService: RegistrationModalState) { }

  toggleSubscribe(): void {
    if (!this.cus.isLoggedIn()) {
      return this.loginPopupService.openModal(LoginPopupState.WELCOME);
    }
    this.disabled = true;
    this.cus.toggleSubscribe(this.channelId).subscribe(() => {
      this.disabled = false;
    });
  }

  isSubscribed(): boolean {
    return this.cus.getUserSubscriptions()?.indexOf(this.channelId) > -1;
  }

}
