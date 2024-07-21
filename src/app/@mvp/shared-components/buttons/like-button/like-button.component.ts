import {Component, Input} from '@angular/core';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';
import {RegistrationModalState, LoginPopupState} from '../../../login-popup/registration-modal-state.service';

@Component({
    selector: 'app-like-button',
    templateUrl: './like-button.component.html',
    styleUrls: ['./like-button.component.scss']
})
export class LikeButtonComponent {

    disabled = false;

    @Input()
    videoId: string;
    @Input()
    likes: number;

    constructor(
        private cus: CurrentUserState,
        private loginPopupService: RegistrationModalState
    ) {
    }

    toggleLike(): void {
        if (!this.cus.isLoggedIn()) {
            return this.loginPopupService.openModal(LoginPopupState.WELCOME);
        }
        this.isLiked() ? this.likes-- : this.likes++;
        this.disabled = true;
        this.cus.toggleLike(this.videoId).subscribe(() => {
            this.disabled = false;
        });
    }

    isLiked(): boolean {
        return this.cus.getUserLikes()?.indexOf(this.videoId) > -1;
    }
}
