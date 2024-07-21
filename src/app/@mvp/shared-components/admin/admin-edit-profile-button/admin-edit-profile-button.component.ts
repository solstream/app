import {Component, Input, OnInit} from '@angular/core';
import {RouterService} from '../../../../_core/services/router.service';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';

@Component({
    selector: 'app-admin-edit-profile-button',
    templateUrl: './admin-edit-profile-button.component.html',
    styleUrls: ['./admin-edit-profile-button.component.scss']
})
export class AdminEditProfileButtonComponent implements OnInit {

    @Input()
    roomId: string;

    constructor(private routerService: RouterService, private cus: CurrentUserState) {
    }

    ngOnInit(): void {
    }

    navigateEditProfile(): void {
        this.routerService.navigateToEditProfile(this.roomId);
    }

    shouldBeDisplayed(): boolean {
        return this.cus.isAdmin() && this.cus.currentUserAccount$.value.id !== this.roomId;
    }

}
